import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { JSDOM } from "jsdom";
import * as core from "../public/sync-core.js";
const html = await readFile(
  new URL("../public/index.html", import.meta.url),
  "utf8",
);
const source = (
  await readFile(new URL("../public/sync.js", import.meta.url), "utf8")
)
  .replace(/\r\n/g, "\n")
  .replace(/^import[\s\S]*?;\n/gm, "");
const record = (kg) => ({
  version: 4,
  weeks: {},
  sessions: {
    "1-0": { entries: { "leg_press_ecc-0": { kg, reps: "10", done: true } } },
  },
});
async function setup({
  local = record("20"),
  base = core.empty(),
  remote = core.empty(),
  onPut,
  applyFail = false,
} = {}) {
  const dom = new JSDOM(html, {
      url: "https://test.invalid",
      runScripts: "outside-only",
    }),
    w = dom.window;
  let data = local,
    server = remote,
    puts = 0,
    etag = '"v1"',
    statuses = [];
  w.localStorage.setItem("fitness-cloud-base-v1", JSON.stringify(base));
  w.__core = core;
  w.setTimeout = () => 1;
  w.clearTimeout = () => {};
  w.setInterval = () => 1;
  w.AbortController = AbortController;
  w.fitnessApp = {
    canSync: () => true,
    getData: () => data,
    applyData: (next) => {
      data = next;
      return !applyFail;
    },
    setStatus: (text, state) => statuses.push({ text, state }),
  };
  w.fetch = async (path, opts = {}) => {
    if (path === "/api/session")
      return { ok: true, json: async () => ({ authenticated: true }) };
    if (opts.method === "PUT") {
      puts++;
      assert.equal(opts.headers["X-Fitness-Schema"], "4");
      if (onPut) {
        const error = onPut({ get: () => data, set: (d) => (data = d), puts });
        if (error)
          return {
            ok: false,
            status: error,
            json: async () => ({ error: "Test bağlantı hatası" }),
          };
      }
      server = JSON.parse(opts.body).data;
      etag = '"v2"';
      return {
        ok: true,
        json: async () => ({ etag, updatedAt: "2026-10-18T10:00:00Z" }),
      };
    }
    return { ok: true, json: async () => ({ data: server, etag }) };
  };
  const controller = await w.eval(
    "(async()=>{const {empty,normalize,merge,same}=window.__core;" +
      source +
      ";return {sync};})()",
  );
  return {
    w,
    controller,
    get: () => data,
    server: () => server,
    puts: () => puts,
    statuses,
    close: () => w.close(),
  };
}
test("successful sync marks cloud current only after a successful PUT", async () => {
  const a = await setup();
  assert.equal(a.puts(), 1);
  assert.equal(a.server().sessions["1-0"].entries["leg_press_ecc-0"].kg, "20");
  assert.equal(a.statuses.at(-1).state, "synced");
  a.close();
});
test("failed PUT keeps local entry and never reports synced", async () => {
  const a = await setup({ onPut: () => 503 });
  assert.equal(a.get().sessions["1-0"].entries["leg_press_ecc-0"].kg, "20");
  assert.equal(
    a.statuses.some((s) => s.state === "synced"),
    false,
  );
  assert.equal(a.statuses.at(-1).state, "error");
  a.close();
});
test("edits made while PUT is in flight survive and are sent in the next sync", async () => {
  const a = await setup({
    onPut: ({ set, puts }) => {
      if (puts === 1) set(record("25"));
    },
  });
  assert.equal(a.get().sessions["1-0"].entries["leg_press_ecc-0"].kg, "25");
  assert.equal(a.server().sessions["1-0"].entries["leg_press_ecc-0"].kg, "20");
  assert.notEqual(a.statuses.at(-1).state, "synced");
  await a.controller.sync();
  assert.equal(a.server().sessions["1-0"].entries["leg_press_ecc-0"].kg, "25");
  assert.equal(a.statuses.at(-1).state, "synced");
  a.close();
});
test("conflict prevents automatic overwrite and exposes both choices", async () => {
  const a = await setup({
    base: record("10"),
    local: record("20"),
    remote: record("30"),
  });
  assert.equal(a.puts(), 0);
  assert.equal(a.w.document.getElementById("cloud-conflict").hidden, false);
  assert.match(
    a.w.document.getElementById("conflict-list").textContent,
    /20.*30/,
  );
  await a.controller.sync("local", '"v1"');
  assert.equal(a.server().sessions["1-0"].entries["leg_press_ecc-0"].kg, "20");
  a.close();
});
test("remote data that cannot persist locally does not advance the merge base", async () => {
  const a = await setup({
    local: core.empty(),
    base: core.empty(),
    remote: record("30"),
    applyFail: true,
  });
  assert.deepEqual(
    JSON.parse(a.w.localStorage.getItem("fitness-cloud-base-v1")),
    core.empty(),
  );
  assert.equal(
    a.statuses.some((s) => s.state === "synced"),
    false,
  );
  a.close();
});
test("repeated ETag conflicts are bounded and do not overwrite server", async () => {
  const a = await setup({ onPut: () => 409 });
  assert.equal(a.puts(), 3);
  assert.equal(
    a.statuses.some((s) => s.state === "synced"),
    false,
  );
  assert.deepEqual(a.server(), core.empty());
  a.close();
});
