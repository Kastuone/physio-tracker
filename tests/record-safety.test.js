import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { empty, normalize, merge } from "../public/sync-core.js";
import { prescription } from "../public/program.js";
import { readRecordBlob, writeRecordBlob } from "../lib/record-store.js";
import {
  authenticated,
  issueSession,
  COOKIE,
  verifyCode,
  sameOrigin,
} from "../lib/auth.js";

const oldV3 = {
  version: 3,
  weeks: { 2: true },
  sessions: {
    "1-0": {
      entries: { "chest-0": { kg: "45", reps: "10", rir: "2", done: true } },
      date: "2026-09-15",
      bike: "15",
      warmup: true,
      cooldown: true,
    },
    "4-0": {
      entries: { "chest-0": { kg: "65", reps: "10", rir: "2", done: true } },
      date: "2026-09-29",
      warmup: true,
    },
  },
};

test("v3 personal log migration preserves legacy sessions in H-archive and seeds default history", () => {
  const result = normalize(oldV3);
  assert.equal(result.version, 4);
  assert.equal(result.sessions["H1-0"].entries["chest-0"].kg, "45");
  assert.equal(result.sessions["H4-0"].entries["chest-0"].kg, "65");
  assert.equal(result.sessions["1-0"], undefined);
  assert.deepEqual(normalize(result), result);
});

test("extra sets and dynamic weeks survive normalization and 3-way merge", () => {
  const base = empty(),
    local = structuredClone(base),
    remote = structuredClone(base);
  local.maxWeek = 26;
  local.sessions["1-0"] = {
    entries: {
      "leg_press_ecc-5": { kg: "22.5", reps: "10", done: true },
    },
    setCounts: { leg_press_ecc: 6 },
  };
  remote.criteria = { rtr_sit_stand: true };
  remote.sessions["1-0"] = {
    note: "İkinci cihaz seans notu",
  };
  const result = merge(base, local, remote);
  assert.equal(result.conflicts.length, 0);
  assert.equal(result.data.maxWeek, 26);
  assert.equal(result.data.criteria.rtr_sit_stand, true);
  assert.equal(
    result.data.sessions["1-0"].entries["leg_press_ecc-5"].kg,
    "22.5",
  );
  assert.equal(result.data.sessions["1-0"].note, "İkinci cihaz seans notu");
  assert.equal(prescription(result.data, 1, 0)[0].count, 6);
});

test("conflicting values require explicit choice; non-conflicting fields survive both choices", () => {
  const base = empty(),
    a = structuredClone(base),
    b = structuredClone(base);
  a.sessions["1-0"] = { entries: { "leg_press_ecc-0": { kg: "20" } } };
  b.sessions["1-0"] = {
    entries: { "leg_press_ecc-0": { kg: "25" } },
    next: "Dizde şişlik yok",
  };
  const result = merge(base, a, b);
  assert.equal(result.conflicts.length, 1);
  assert.equal(
    merge(base, a, b, "remote").data.sessions["1-0"].entries["leg_press_ecc-0"]
      .kg,
    "25",
  );
  assert.equal(
    merge(base, a, b, "local").data.sessions["1-0"].next,
    "Dizde şişlik yok",
  );
});

test("prescription reflects 3-day ACL + Hypertrophy sets, Stage 3 rep shift, and autoregulation reductions", () => {
  const d = empty(),
    total = (w, day) =>
      prescription(d, w, day).reduce((n, r) => n + r.target, 0);
  // Day A = 33 sets, Day B = 32 sets, Day C = 25 sets
  assert.deepEqual(
    [0, 1, 2].map((i) => total(1, i)),
    [33, 32, 25],
  );
  // Stage 3 (Week 14) shifts ACL exercises like leg_press_ecc to 6-8 rep band
  const stage3Row = prescription(d, 14, 0)[0];
  assert.equal(stage3Row.lo, 6);
  assert.equal(stage3Row.hi, 8);
  // Autoregulation reduce (-1 per exercise)
  d.sessions["1-0"] = { reduce: true };
  assert.equal(total(1, 0), 24);
});

test("unsupported sets and corrupt imports are rejected rather than silently truncated", () => {
  const d = empty();
  d.sessions["1-0"] = { entries: { "leg_press_ecc-20": { kg: "20" } } };
  assert.throws(() => normalize(d));
  assert.throws(() => normalize({ version: 99, weeks: {}, sessions: {} }));
  d.sessions["1-0"] = { entries: { "leg_press_ecc-0": { kg: "-1" } } };
  assert.throws(() => normalize(d));
});

test("Blob reads preserve the strong ETag; weak versions are refused", async () => {
  let opts;
  const result = await readRecordBlob("test", async (path, o) => {
    opts = o;
    return { blob: { etag: '"strong"' } };
  });
  assert.equal(result.blob.etag, '"strong"');
  assert.equal(opts.headers["Accept-Encoding"], "identity");
  await assert.rejects(
    readRecordBlob("test", async () => ({ blob: { etag: 'W/"weak"' } })),
  );
});

test("Blob writes use ifMatch and first-write protection, never blind overwrite", async () => {
  const calls = [];
  const writer = async (...args) => {
    calls.push(args);
    return { etag: '"new"' };
  };
  await writeRecordBlob(empty(), '"old"', writer, "test");
  await writeRecordBlob(empty(), null, writer, "test");
  assert.equal(calls[0][2].ifMatch, '"old"');
  assert.equal(calls[1][2].allowOverwrite, false);
  assert.equal(calls[0][2].access, "private");
});

test("existing authentication retains signed expiry cookie and origin checks", () => {
  process.env.FITNESS_ACCESS_HASH = createHash("sha256")
    .update("fictional-test-code")
    .digest("hex");
  process.env.FITNESS_SESSION_SECRET = "test-only-secret-not-for-deployment";
  process.env.FITNESS_ORIGIN = "https://test.invalid";
  assert.equal(verifyCode("fictional-test-code"), true);
  assert.equal(verifyCode("wrong"), false);
  const token = issueSession();
  assert.equal(
    authenticated({ headers: { cookie: `${COOKIE}=${token}` } }),
    true,
  );
  assert.equal(
    authenticated({ headers: { cookie: `${COOKIE}=${token}x` } }),
    false,
  );
  assert.equal(
    sameOrigin({ headers: { origin: "https://test.invalid" } }),
    true,
  );
  assert.equal(
    sameOrigin({ headers: { origin: "https://other.invalid" } }),
    false,
  );
});
