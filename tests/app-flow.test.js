import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { JSDOM } from "jsdom";
import * as core from "../public/sync-core.js";
import * as program from "../public/program.js";
import { icon } from "../public/icons.js";
const html = await readFile(
  new URL("../public/index.html", import.meta.url),
  "utf8",
);
const src = (
  await readFile(new URL("../public/app.js", import.meta.url), "utf8")
)
  .replace(/^import[\s\S]*?;\n/gm, "")
  .replace(/import\(["']\.\/sync\.js["']\)/, "Promise.resolve()");
const KEY = "upper-body-4weeks-v1";
function app({ demo = false, stored = {}, quota = false } = {}) {
  const dom = new JSDOM(html, {
    url: "https://test.invalid/" + (demo ? "?demo=1" : ""),
    runScripts: "outside-only",
    pretendToBeVisual: true,
  });
  const w = dom.window;
  w.scrollTo = () => {};
  w.matchMedia = () => ({ matches: true });
  w.HTMLElement.prototype.scrollIntoView = () => {};
  w.HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  w.HTMLDialogElement.prototype.close = function () {
    this.open = false;
  };
  w.__deps = { ...core, ...program, icon };
  for (const [k, v] of Object.entries(stored)) w.localStorage.setItem(k, v);
  if (quota)
    w.Storage.prototype.setItem = function () {
      throw new Error("QuotaExceededError");
    };
  w.eval(
    "const {empty,normalize,merge,MAX_SETS,DAYS,EXERCISES,prescription,applyThreeSetSession,icon}=window.__deps;\n" +
      src,
  );
  return {
    dom,
    w,
    d: w.document,
    close: () => setTimeout(() => w.close(), 20),
  };
}
function fill(a, selector, value) {
  const el = a.d.querySelector(selector);
  assert.ok(el, selector);
  el.value = value;
  el.dispatchEvent(new a.w.Event("input", { bubbles: true }));
}
const input = (key, field) => `[data-entry="${key}"] [data-field="${field}"]`;
const click = (a, selector) => {
  const el = a.d.querySelector(selector);
  assert.ok(el, selector);
  el.click();
};
test("complete flow: log, complete, correct, change day, return, reload and review history", () => {
  let a = app();
  fill(a, input("chest-0", "kg"), "32.5");
  fill(a, input("chest-0", "reps"), "12");
  click(a, '[data-done="chest-0"]');
  assert.equal(
    a.w.fitnessApp.getData().sessions["1-0"].entries["chest-0"].done,
    true,
  );
  fill(a, input("chest-0", "kg"), "35");
  click(a, '[data-day="1"]');
  click(a, '[data-day="0"]');
  assert.equal(a.d.querySelector(input("chest-0", "kg")).value, "35");
  const stored = a.w.localStorage.getItem(KEY);
  a.close();
  a = app({ stored: { [KEY]: stored } });
  assert.equal(a.d.querySelector(input("chest-0", "kg")).value, "35");
  click(a, '[data-view="history"]');
  assert.match(
    a.d.getElementById("history-list").textContent,
    /35 kg × 12 tekrar/,
  );
  assert.match(a.d.getElementById("history-stats").textContent, /420/);
  a.close();
});
test("add/remove set retains hidden values and restores them after reload", () => {
  let a = app();
  click(a, '[data-plus="chest"]');
  fill(a, input("chest-2", "kg"), "40");
  fill(a, input("chest-2", "reps"), "8");
  click(a, '[data-done="chest-2"]');
  click(a, '[data-minus="chest"]');
  assert.equal(a.d.querySelector(input("chest-2", "kg")), null);
  assert.equal(
    a.w.fitnessApp.getData().sessions["1-0"].entries["chest-2"].kg,
    "40",
  );
  const stored = a.w.localStorage.getItem(KEY);
  a.close();
  a = app({ stored: { [KEY]: stored } });
  click(a, '[data-plus="chest"]');
  assert.equal(a.d.querySelector(input("chest-2", "kg")).value, "40");
  assert.equal(
    a.d.querySelector('[data-done="chest-2"]').getAttribute("aria-pressed"),
    "true",
  );
  a.close();
});
test("clearing completed weight reopens set; negative values are never saved", () => {
  const a = app();
  fill(a, input("chest-0", "kg"), "0");
  fill(a, input("chest-0", "reps"), "12");
  click(a, '[data-done="chest-0"]');
  fill(a, input("chest-0", "kg"), "");
  assert.equal(
    a.w.fitnessApp.getData().sessions["1-0"].entries["chest-0"].done,
    undefined,
  );
  fill(a, input("chest-0", "kg"), "-10");
  assert.equal(
    a.w.fitnessApp.getData().sessions["1-0"].entries["chest-0"].kg,
    undefined,
  );
  assert.equal(
    a.d.querySelector(input("chest-0", "kg")).getAttribute("aria-invalid"),
    "true",
  );
  a.close();
});
test("empty history is truthful and incomplete sets appear as drafts", () => {
  const a = app();
  click(a, '[data-view="history"]');
  assert.match(
    a.d.getElementById("history-list").textContent,
    /HENÜZ BİR KAYIT YOK/,
  );
  click(a, '[data-view="training"]');
  fill(a, input("chest-0", "kg"), "10");
  click(a, '[data-view="history"]');
  assert.match(a.d.getElementById("history-list").textContent, /taslak/);
  a.close();
});
test("v1 data is backed up before first edit, preserving notes and adaptation fields", () => {
  const raw = JSON.stringify({
    version: 1,
    weeks: { 2: true },
    sessions: {
      "1-0": {
        note: "Kurgusal not",
        next: "Test",
        bike: "4",
        entries: { "row-2": { kg: "40", reps: "10", done: true } },
      },
      "1-2": { physio: true },
    },
  });
  const a = app({ stored: { [KEY]: raw } });
  fill(a, input("chest-0", "kg"), "20");
  assert.equal(a.w.localStorage.getItem(KEY + "-backup-before-v2"), raw);
  assert.equal(
    a.w.fitnessApp.getData().sessions["1-0"].entries["row-2"].kg,
    "40",
  );
  assert.equal(a.w.fitnessApp.getData().sessions["1-2"].physio, true);
  a.close();
});
test("quota failure never reports saved and blocks sync, retaining in-memory draft", () => {
  const a = app({ quota: true });
  fill(a, input("chest-0", "kg"), "20");
  assert.equal(a.w.fitnessApp.canSync(), false);
  assert.equal(
    a.w.fitnessApp.getData().sessions["1-0"].entries["chest-0"].kg,
    "20",
  );
  assert.equal(a.d.getElementById("save-label").textContent, "Kaydedilemedi");
  assert.equal(a.d.getElementById("storage-error").hidden, false);
  a.close();
});
test("corrupt local data is not overwritten and cannot sync", () => {
  const a = app({ stored: { [KEY]: "{corrupt" } });
  assert.equal(a.w.localStorage.getItem(KEY), "{corrupt");
  assert.equal(a.w.fitnessApp.canSync(), false);
  assert.equal(a.d.querySelector(input("chest-0", "kg")).disabled, true);
  a.close();
});
test("demo edits never change personal local records", () => {
  const raw = JSON.stringify(core.empty()),
    a = app({ demo: true, stored: { [KEY]: raw } });
  fill(a, input("chest-0", "kg"), "999");
  assert.equal(a.w.localStorage.getItem(KEY), raw);
  assert.equal(
    a.w.sessionStorage.getItem("fitness-demo-v2").includes("999"),
    true,
  );
  assert.equal(a.d.getElementById("cloud-login").hidden, true);
  a.close();
});
test("all days and views render; extra-long alternative names remain exact", () => {
  const a = app({
    stored: {
      [KEY]: JSON.stringify({
        version: 1,
        weeks: {},
        sessions: {
          "1-0": {
            alts: { row: "Incline Bench Chest-Supported Dumbbell Row" },
          },
        },
      }),
    },
  });
  for (const day of [0, 1, 2]) {
    click(a, `[data-day="${day}"]`);
    assert.equal(a.d.querySelectorAll(".exercise").length, 6);
  }
  for (const view of ["program", "history", "training"]) {
    click(a, `[data-view="${view}"]`);
    assert.equal(a.d.getElementById(view + "-view").hidden, false);
  }
  click(a, '[data-day="0"]');
  assert.match(
    a.d.getElementById("exercise-row").textContent,
    /Incline Bench Chest-Supported Dumbbell Row/,
  );
  a.close();
});

test("new routine survives reload without changing existing records", () => {
  const original = {
    version: 2,
    weeks: {},
    sessions: {
      "1-1": { entries: { "triceps-0": { kg: "15", reps: "12", done: true } } },
    },
  };
  const a = app({ stored: { [KEY]: JSON.stringify(original) } });
  click(a, '[data-day="0"]');
  click(a, "#apply-three-sets");
  const saved = a.w.localStorage.getItem(KEY);
  const parsed = JSON.parse(saved);
  assert.equal(parsed.sessions["1-0"].setCounts.chest, 3);
  assert.equal(
    parsed.sessions["1-0"].alts.lateral,
    "Standing Dumbbell Lateral Raise",
  );
  assert.equal(
    parsed.sessions["1-0"].alts.triceps,
    "Standing Cable Triceps Pushdown",
  );
  assert.deepEqual(parsed.sessions["1-1"], original.sessions["1-1"]);
  click(a, '[data-day="1"]');
  click(a, "#apply-three-sets");
  assert.deepEqual(
    JSON.parse(a.w.localStorage.getItem(KEY)).sessions["1-1"],
    original.sessions["1-1"],
  );
  a.close();
  const b = app({ stored: { [KEY]: saved } });
  click(b, '[data-day="0"]');
  assert.equal(b.d.querySelectorAll("#exercise-chest .set-row").length, 3);
  assert.match(
    b.d.getElementById("exercise-lateral").textContent,
    /Standing Dumbbell/,
  );
  click(b, '[data-view="program"]');
  click(b, "#rehab-note");
  assert.match(b.d.getElementById("note").value, /Diz takibi/);
  b.close();
});

test("phase 2 logs weights and seconds, retains hidden sets and history after reload", () => {
  let a = app();
  click(a, "#apply-three-sets");
  click(a, "#enable-rehab");
  assert.equal(a.d.querySelectorAll(".exercise").length, 11);
  fill(a, input("legpress-0", "kg"), "20");
  fill(a, input("legpress-0", "reps"), "12");
  click(a, '[data-done="legpress-0"]');
  fill(a, input("balance-0", "seconds"), "30");
  click(a, '[data-done="balance-0"]');
  assert.equal(
    a.w.fitnessApp.getData().sessions["1-0"].entries["balance-0"].done,
    true,
  );
  click(a, '[data-plus="bridge"]');
  fill(a, input("bridge-3", "kg"), "0");
  fill(a, input("bridge-3", "reps"), "15");
  click(a, '[data-minus="bridge"]');
  const saved = a.w.localStorage.getItem(KEY);
  a.close();
  a = app({ stored: { [KEY]: saved } });
  assert.equal(a.d.querySelector(input("balance-0", "seconds")).value, "30");
  click(a, '[data-plus="bridge"]');
  assert.equal(a.d.querySelector(input("bridge-3", "reps")).value, "15");
  click(a, '[data-day="1"]');
  assert.equal(a.d.querySelectorAll(".exercise").length, 6);
  click(a, '[data-day="0"]');
  assert.equal(a.d.querySelectorAll(".exercise").length, 11);
  click(a, '[data-view="history"]');
  assert.match(a.d.getElementById("history-list").textContent, /30 saniye/);
  assert.match(a.d.getElementById("history-stats").textContent, /240/);
  a.close();
});
