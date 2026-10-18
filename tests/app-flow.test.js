import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { JSDOM } from "jsdom";
import * as core from "../public/sync-core.js";
import * as program from "../public/program.js";
import { icon } from "../public/icons.js";
import { getExerciseVisual } from "../public/exercise-visuals.js";

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
  w.setInterval = () => 1;
  w.matchMedia = () => ({ matches: true });
  w.HTMLElement.prototype.scrollIntoView = () => {};
  w.HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  w.HTMLDialogElement.prototype.close = function () {
    this.open = false;
  };
  w.__deps = { ...core, ...program, icon, getExerciseVisual };
  for (const [k, v] of Object.entries(stored)) w.localStorage.setItem(k, v);
  if (quota)
    w.Storage.prototype.setItem = function () {
      throw new Error("QuotaExceededError");
    };
  w.eval(
    "const {empty,normalize,merge,MAX_SETS,MAX_WEEKS,DEFAULT_MAX_WEEK,DAYS,EXERCISES,STAGES,WARMUP_PROTOCOL,getStageForWeek,postOpWeek,prescription,icon,getExerciseVisual}=window.__deps;\n" +
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

test("complete flow: log ACL & hypertrophy sets, switch days, verify background & embedded history", () => {
  let a = app();
  // Default theme is dark and day is 0 (Tuesday)
  assert.equal(a.d.documentElement.dataset.theme, "dark");
  assert.equal(a.d.body.dataset.day, "0");

  // Hero showcase renders 3 cards on main training view
  assert.equal(a.d.getElementById("hero-showcase").hidden, false);
  assert.equal(a.d.getElementById("hero-weekly-pct").textContent, "65%");
  assert.match(
    a.d.getElementById("hero-program-title").textContent,
    /BUGÜNKÜ PROGRAM \(GÜN A: SALI\)/,
  );
  assert.equal(a.d.querySelectorAll(".hero-prog-item").length, 4);

  // Toggle theme to light and back to dark
  click(a, "#theme-toggle");
  assert.equal(a.d.documentElement.dataset.theme, "light");
  click(a, "#theme-toggle");
  assert.equal(a.d.documentElement.dataset.theme, "dark");

  // Log set on first exercise of Day A (leg_press_ecc)
  fill(a, input("leg_press_ecc-0", "kg"), "20");
  fill(a, input("leg_press_ecc-0", "reps"), "12");
  click(a, '[data-done="leg_press_ecc-0"]');
  assert.equal(
    a.w.fitnessApp.getData().sessions["1-0"].entries["leg_press_ecc-0"].done,
    true,
  );

  // Switch to Day B (Thursday) -> background day updates to 1 and hero program title updates
  click(a, '[data-day="1"]');
  assert.equal(a.d.body.dataset.day, "1");
  assert.match(
    a.d.getElementById("hero-program-title").textContent,
    /BUGÜNKÜ PROGRAM \(GÜN B: PERŞEMBE\)/,
  );
  click(a, '[data-day="0"]');
  assert.equal(a.d.querySelector(input("leg_press_ecc-0", "kg")).value, "20");

  // Reload with stored state
  const stored = a.w.localStorage.getItem(KEY);
  a.close();
  a = app({ stored: { [KEY]: stored } });
  assert.equal(a.d.querySelector(input("leg_press_ecc-0", "kg")).value, "20");

  // Check History view includes both new entry AND Tamer's embedded historical logs (e.g. 65 kg × 10 tekrar from H4-0)
  click(a, '[data-view="history"]');
  assert.equal(a.d.getElementById("hero-showcase").hidden, true);
  const historyText = a.d.getElementById("history-list").textContent;
  assert.match(historyText, /20 kg × 12 tekrar/);
  assert.match(historyText, /65 kg × 10 tekrar/);
  a.close();
});

test("unlimited week addition and 4-stage periodization transitions work", () => {
  const a = app();
  assert.match(a.d.getElementById("stage-banner").textContent, /1\. AŞAMA/);

  // Select week 7 -> Stage 2 (Linear Running Progression)
  const weekSelect = a.d.getElementById("week");
  weekSelect.value = "7";
  weekSelect.dispatchEvent(new a.w.Event("change", { bubbles: true }));
  assert.match(a.d.getElementById("stage-banner").textContent, /2\. AŞAMA/);

  // Add a new week beyond default maxWeek (22 -> 23, Stage 4)
  click(a, "#add-week");
  assert.equal(a.w.fitnessApp.getData().maxWeek, 23);
  assert.equal(a.d.getElementById("week").value, "23");
  assert.match(a.d.getElementById("stage-banner").textContent, /4\. AŞAMA/);
  a.close();
});

test("add/remove set retains hidden values and restores them after reload", () => {
  let a = app();
  click(a, '[data-plus="leg_press_ecc"]');
  fill(a, input("leg_press_ecc-4", "kg"), "25");
  fill(a, input("leg_press_ecc-4", "reps"), "10");
  click(a, '[data-done="leg_press_ecc-4"]');
  click(a, '[data-minus="leg_press_ecc"]');
  assert.equal(a.d.querySelector(input("leg_press_ecc-4", "kg")), null);
  assert.equal(
    a.w.fitnessApp.getData().sessions["1-0"].entries["leg_press_ecc-4"].kg,
    "25",
  );
  const stored = a.w.localStorage.getItem(KEY);
  a.close();
  a = app({ stored: { [KEY]: stored } });
  click(a, '[data-plus="leg_press_ecc"]');
  assert.equal(a.d.querySelector(input("leg_press_ecc-4", "kg")).value, "25");
  assert.equal(
    a.d
      .querySelector('[data-done="leg_press_ecc-4"]')
      .getAttribute("aria-pressed"),
    "true",
  );
  a.close();
});

test("clearing completed weight reopens set; negative values are never saved", () => {
  const a = app();
  fill(a, input("leg_press_ecc-0", "kg"), "0");
  fill(a, input("leg_press_ecc-0", "reps"), "12");
  click(a, '[data-done="leg_press_ecc-0"]');
  fill(a, input("leg_press_ecc-0", "kg"), "");
  assert.equal(
    a.w.fitnessApp.getData().sessions["1-0"].entries["leg_press_ecc-0"].done,
    undefined,
  );
  fill(a, input("leg_press_ecc-0", "kg"), "-10");
  assert.equal(
    a.w.fitnessApp.getData().sessions["1-0"].entries["leg_press_ecc-0"].kg,
    undefined,
  );
  assert.equal(
    a.d
      .querySelector(input("leg_press_ecc-0", "kg"))
      .getAttribute("aria-invalid"),
    "true",
  );
  a.close();
});

test("quota failure never reports saved and blocks sync, retaining in-memory draft", () => {
  const a = app({ quota: true });
  fill(a, input("leg_press_ecc-0", "kg"), "20");
  assert.equal(a.w.fitnessApp.canSync(), false);
  assert.equal(
    a.w.fitnessApp.getData().sessions["1-0"].entries["leg_press_ecc-0"].kg,
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
  assert.equal(
    a.d.querySelector(input("leg_press_ecc-0", "kg")).disabled,
    true,
  );
  a.close();
});

test("all 3 days render exercise visuals and prior references from archived logs", () => {
  const a = app();
  // Day A has 9 exercises, Day B has 9, Day C has 8
  const expectedCounts = [9, 9, 8];
  for (const day of [0, 1, 2]) {
    click(a, `[data-day="${day}"]`);
    assert.equal(a.d.querySelectorAll(".exercise").length, expectedCounts[day]);
    assert.ok(
      a.d.querySelectorAll(".exercise-visual-card svg").length >=
        expectedCounts[day],
    );
  }
  // Check that incline_db_press on Day 0 shows prior reference from archived chest log (65 kg × 10 tekrar)
  click(a, '[data-day="0"]');
  assert.match(
    a.d.getElementById("exercise-incline_db_press").textContent,
    /65 kg × 10 tekrar/,
  );
  a.close();
});
