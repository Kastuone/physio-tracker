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
const old = {
  version: 1,
  weeks: { 2: true },
  sessions: {
    "1-0": {
      entries: { "chest-0": { kg: "32.5", reps: "10", rir: "3", done: true } },
      alts: { chest: "Dumbbell Bench Press" },
      date: "2026-09-15",
      note: "Kurgusal test notu",
      next: "Kurgusal toparlanma notu",
      bike: "8",
      warmup: true,
      cooldown: true,
    },
    "2-2": {
      physio: true,
      reduce: true,
      entries: { "preacher-1": { kg: "8", reps: "12", done: true } },
    },
  },
};
test("v1 migration preserves every original field and hidden rehabilitation entry", () => {
  const result = normalize(old);
  assert.deepEqual(result, { ...old, version: 2 });
  assert.deepEqual(normalize(result), result);
});
test("extra sets survive removal, normalization, merging and restoration", () => {
  const original = normalize(old),
    local = structuredClone(original);
  local.sessions["1-0"].entries["chest-4"] = {
    kg: "35",
    reps: "8",
    done: true,
  };
  local.sessions["1-0"].setCounts = { chest: 2 };
  const remote = structuredClone(original);
  remote.sessions["1-0"].note = "İkinci cihaz notu";
  const result = merge(original, local, remote);
  assert.equal(result.conflicts.length, 0);
  assert.equal(result.data.sessions["1-0"].entries["chest-4"].kg, "35");
  assert.equal(result.data.sessions["1-0"].note, "İkinci cihaz notu");
  result.data.sessions["1-0"].setCounts.chest = 5;
  assert.equal(prescription(result.data, 1, 0)[0].count, 5);
});
test("conflicting values require explicit choice; non-conflicting fields survive both choices", () => {
  const base = normalize(old),
    a = structuredClone(base),
    b = structuredClone(base);
  a.sessions["1-0"].entries["chest-0"].kg = "35";
  b.sessions["1-0"].entries["chest-0"].kg = "37.5";
  b.sessions["1-0"].next = "Yeni not";
  const result = merge(base, a, b);
  assert.equal(result.conflicts.length, 1);
  assert.equal(
    merge(base, a, b, "remote").data.sessions["1-0"].entries["chest-0"].kg,
    "37.5",
  );
  assert.equal(
    merge(base, a, b, "local").data.sessions["1-0"].next,
    "Yeni not",
  );
});
test("prescription retains original 12 / 14 / 14 / 12 sets and physio reduction", () => {
  const d = empty(),
    total = (w, day) =>
      prescription(d, w, day).reduce((n, r) => n + r.target, 0);
  assert.equal(total(1, 0), 12);
  assert.equal(total(2, 0), 12);
  d.weeks[2] = true;
  assert.deepEqual(
    [0, 1, 2].map((i) => total(2, i)),
    [14, 14, 12],
  );
  d.sessions["2-2"] = { physio: true };
  assert.equal(total(2, 2), 8);
  d.sessions["2-2"].reduce = true;
  assert.equal(total(2, 2), 4);
  assert.deepEqual(
    prescription(d, 2, 2).map((r) => r.id),
    ["lat", "chest", "row", "lateral"],
  );
});
test("unsupported sets and corrupt imports are rejected rather than silently truncated", () => {
  const d = normalize(old);
  d.sessions["1-0"].entries["chest-20"] = { kg: "20" };
  assert.throws(() => normalize(d));
  assert.throws(() => normalize({ version: 3, weeks: {}, sessions: {} }));
  d.sessions["1-0"].entries = { "chest-0": { kg: "-1" } };
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
