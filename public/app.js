import { empty, normalize, merge, MAX_SETS } from "./sync-core.js";
import {
  DAYS,
  EXERCISES,
  prescription,
  applyThreeSetSession,
} from "./program.js";
import { icon } from "./icons.js";
const $ = (id) => document.getElementById(id),
  esc = (v) =>
    String(v ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
const demo = new URLSearchParams(location.search).get("demo") === "1",
  KEY = demo ? "fitness-demo-v2" : "upper-body-4weeks-v1",
  UIKEY = demo ? "fitness-demo-ui" : "fitness-ui-v2";
const storage = {
  getItem: (key) => (demo ? sessionStorage : localStorage).getItem(key),
  setItem: (key, value) =>
    (demo ? sessionStorage : localStorage).setItem(key, value),
};
let data = empty(),
  rawOriginal = null,
  blocked = false,
  saved = true,
  ui = { week: 1, day: 0, view: "training", open: ["chest"], timerSeconds: 90 },
  toastTimeout;
function demoData() {
  const d = empty();
  d.weeks[2] = true;
  for (let day = 0; day < 3; day++) {
    const s = { date: `2026-09-${15 + day * 2}`, entries: {} };
    for (const [id] of DAYS[day].rows)
      for (let n = 0; n < 2; n++)
        s.entries[`${id}-${n}`] = {
          kg: String(
            ["lateral", "preacher", "triceps", "hammer"].includes(id) ? 8 : 30,
          ),
          reps: String(12 - n),
          rir: "3",
          done: true,
        };
    d.sessions[`1-${day}`] = s;
  }
  d.sessions["2-0"] = {
    date: "2026-09-22",
    entries: {
      "chest-0": { kg: "32.5", reps: "12", rir: "3", done: true },
      "chest-1": { kg: "32.5", reps: "10", rir: "3", done: true },
    },
  };
  return d;
}
try {
  rawOriginal = storage.getItem(KEY);
  if (rawOriginal) data = normalize(JSON.parse(rawOriginal));
  else if (demo) {
    data = demoData();
    ui.week = 2;
    storage.setItem(KEY, JSON.stringify(data));
  }
} catch {
  blocked = true;
  $("storage-error").hidden = false;
  $("storage-error").textContent =
    "Mevcut kayıt okunamadı. Üzerine yazmayı ve eşitlemeyi durdurduk. Ayarlardan mevcut dosyanı indirip yedeğini yükleyebilirsin.";
}
try {
  const u = JSON.parse(storage.getItem(UIKEY) || "null");
  if (u && [1, 2, 3, 4].includes(u.week) && [0, 1, 2].includes(u.day)) {
    ui = {
      ...ui,
      week: u.week,
      day: u.day,
      view: ["training", "program", "history"].includes(u.view)
        ? u.view
        : "training",
      open: Array.isArray(u.open)
        ? u.open.filter((id) => Object.hasOwn(EXERCISES, id))
        : ui.open,
      timerSeconds: [60, 90, 120].includes(u.timerSeconds)
        ? u.timerSeconds
        : 90,
    };
    if (Number.isFinite(u.timerEnd)) ui.timerEnd = u.timerEnd;
    if (
      Number.isFinite(u.timerRemaining) &&
      u.timerRemaining >= 0 &&
      u.timerRemaining <= 120
    )
      ui.timerRemaining = u.timerRemaining;
  }
} catch {}
const session = () => data.sessions[`${ui.week}-${ui.day}`] || {};
function mutable() {
  return (data.sessions[`${ui.week}-${ui.day}`] ??= {});
}
function saveUI() {
  try {
    storage.setItem(UIKEY, JSON.stringify(ui));
  } catch {}
}
function toast(text) {
  clearTimeout(toastTimeout);
  $("toast").textContent = text;
  $("toast").hidden = false;
  toastTimeout = setTimeout(() => ($("toast").hidden = true), 3500);
}
function status(text, state = "local") {
  $("save-label").textContent = demo ? "Örnek günlük" : text;
  $("save-badge").dataset.state = state;
}
function persist() {
  if (blocked) return false;
  try {
    data = normalize(data);
    if (!demo && rawOriginal && !storage.getItem(KEY + "-backup-before-v3"))
      storage.setItem(KEY + "-backup-before-v3", rawOriginal);
    if (!demo && rawOriginal && !storage.getItem(KEY + "-backup-before-v2")) {
      storage.setItem(KEY + "-backup-before-v2", rawOriginal);
      rawOriginal = null;
    }
    storage.setItem(KEY, JSON.stringify(data));
    rawOriginal = null;
    saved = true;
    $("storage-error").hidden = true;
    status("Cihazda kayıtlı");
    window.dispatchEvent(new Event("fitness-change"));
    return true;
  } catch {
    saved = false;
    status("Kaydedilemedi", "error");
    $("storage-error").hidden = false;
    $("storage-error").textContent =
      "Cihaza kaydedilemedi. Açık sayfadaki girişlerin duruyor; sayfayı kapatmadan Ayarlar → Yedeği indir ile sakla.";
    return false;
  }
}
function mutate(fn) {
  if (blocked) {
    toast("Kayıt kurtarılana kadar düzenleme kapalı.");
    return false;
  }
  fn(mutable());
  return persist();
}
function hydrate() {
  document
    .querySelectorAll("[data-icon]")
    .forEach((el) => (el.innerHTML = icon(el.dataset.icon)));
}
function activeRows() {
  return prescription(data, ui.week, ui.day).filter(
    (r) => session().alts?.[r.id] !== "Bu hareketi çıkar",
  );
}
function exerciseName(s, id) {
  return s.alts?.[id] || EXERCISES[id]?.name || id;
}
function recorded(s) {
  return Object.entries(s.entries || {}).filter(
    ([, e]) => Object.keys(e).length,
  );
}
function prior(id) {
  const current = ui.week * 3 + ui.day,
    variant = exerciseName(session(), id);
  return Object.entries(data.sessions)
    .filter(([k, s]) => {
      const [w, d] = k.split("-").map(Number);
      return (
        w * 3 + d < current &&
        exerciseName(s, id) === variant &&
        recorded(s).some(([ek, e]) => ek.startsWith(id + "-") && e.done)
      );
    })
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([k, s]) => ({
      key: k,
      s,
      entries: recorded(s).filter(
        ([ek, e]) => ek.startsWith(id + "-") && e.done,
      ),
    }))[0];
}
const performance = (e) =>
  e.seconds !== undefined
    ? `${e.seconds || "—"} saniye`
    : `${e.kg ?? "—"} kg × ${e.reps ?? "—"} tekrar`;
function renderExercise(r) {
  const s = session(),
    ex = EXERCISES[r.id],
    targetLabel = `${r.lo === r.hi ? r.lo : r.lo + "-" + r.hi} ${ex.timed ? "saniye" : "tekrar"}`;
  if (s.alts?.[r.id] === "Bu hareketi çıkar")
    return `<div class="removed-exercise"><span>${ex.name} · Bu seanstan çıkarıldı</span><button class="text-button" data-restore="${r.id}">Hareketi geri ekle</button></div>`;
  const last = prior(r.id),
    complete = Array.from(
      { length: r.count },
      (_, n) => s.entries?.[`${r.id}-${n}`],
    ).filter((e) => e?.done).length,
    archived = recorded(s).filter(
      ([ek]) =>
        ek.startsWith(r.id + "-") && Number(ek.split("-").at(-1)) >= r.count,
    ),
    hasEntries = recorded(s).some(([ek]) => ek.startsWith(r.id + "-"));
  return `<details class="exercise" id="exercise-${r.id}" data-exercise="${r.id}" ${ui.open.includes(r.id) ? "open" : ""}><summary class="exercise-summary"><span class="exercise-index">${String(r.index + 1).padStart(2, "0")}</span><span class="exercise-name"><h3>${esc(exerciseName(s, r.id))}</h3><small>${ex.group} <span>·</span> ${r.count} set × ${targetLabel}</small></span><span class="summary-count">${complete}/${r.count}</span><span class="chevron">${icon("chevron")}</span></summary><div class="exercise-body"><div class="exercise-info"><span class="target-tag">${targetLabel}</span>${ex.rehab ? "<span>Hocanın Faz 2 planı · yük ve dinlenme kişisel</span>" : `<span>${r.rest} sn dinlenme</span><span>RIR ${ui.week === 1 ? "3-4" : "2-3"}</span>`}</div><p class="previous-line">${last ? `<span>SON SEANS</span> ${esc(performance(last.entries[0][1]))} <small>· ${last.key.split("-")[0]}. hafta</small>` : "<span>İLK REFERANSIN</span> Bu hareket için tamamlanmış önceki set yok."}</p><div class="set-table ${ex.timed ? "timed" : ""}" role="group" aria-label="${esc(exerciseName(s, r.id))} setleri"><div class="set-header"><span>SET</span><span>AĞIRLIK <small>kg</small></span><span>${ex.timed ? "SÜRE · sn" : "TEKRAR"}</span><span>${ex.timed ? "—" : "RIR"}</span><span>TAMAM</span></div>${Array.from(
    { length: r.count },
    (_, n) => {
      const ek = `${r.id}-${n}`,
        e = s.entries?.[ek] || {};
      return `<div class="set-row ${e.done ? "is-done" : ""}" data-entry="${ek}"><span class="set-number">${String(n + 1).padStart(2, "0")}</span>${["kg", ex.timed ? "seconds" : "reps", "rir"].map((f) => `<input ${ex.timed && f !== "seconds" ? 'disabled aria-hidden="true" style="display:none"' : ""} type="number" inputmode="${f === "reps" ? "numeric" : "decimal"}" min="0" step="${f === "reps" ? "1" : "any"}" data-field="${f}" value="${esc(e[f])}" placeholder="—" aria-label="${esc(exerciseName(s, r.id))}, ${n + 1}. set ${f === "kg" ? "ağırlık (kg)" : f === "seconds" ? "süre (saniye)" : f === "reps" ? "tekrar" : "RIR"}">`).join("")}<button class="done-button" data-done="${ek}" aria-label="${esc(exerciseName(s, r.id))}, ${n + 1}. set ${e.done ? "tamamlandı, geri al" : "tamamla"}" aria-pressed="${!!e.done}">${icon("check")}</button></div>`;
    },
  ).join(
    "",
  )}</div><p class="field-error" id="error-${r.id}" role="status" hidden></p><div class="set-controls"><button class="text-button" data-minus="${r.id}" ${r.count === 0 ? "disabled" : ""}>${icon("minus")} Set çıkar</button><button class="text-button" data-plus="${r.id}" ${r.count >= MAX_SETS ? "disabled" : ""}>${icon("plus")} Set ekle</button>${s.setCounts?.[r.id] !== undefined ? `<button class="reset-count" data-reset-count="${r.id}">Programdaki sayıya dön (${r.target})</button>` : ""}</div>${archived.length ? `<details class="archived"><summary>Gizlenen ${archived.length} setin kaydı korunuyor</summary>${archived.map(([ek, e]) => `<p>${Number(ek.split("-").at(-1)) + 1}. set · ${esc(performance(e))}${e.done ? " · Tamamlandı" : ""}</p>`).join("")}<p>Set ekleyerek tekrar düzenleyebilirsin.</p></details>` : ""}<details class="exercise-options"><summary>Hareket bilgisi & alternatifler</summary>${ex.alt.length ? `<label>Hareket seçimi<select data-alt="${r.id}" ${hasEntries ? "disabled" : ""}>${[ex.name, ...ex.alt, ...(s.alts?.[r.id] && ![ex.name, ...ex.alt].includes(s.alts[r.id]) ? [s.alts[r.id]] : [])].map((n) => `<option ${exerciseName(s, r.id) === n ? "selected" : ""}>${esc(n)}</option>`).join("")}</select></label>` : ""}<p>${hasEntries && ex.alt.length ? "Kaydın hangi harekete ait olduğunu korumak için seçim kilitli. " : ""}${esc(ex.note || "Ağırlığı kontrollü indir, hareketi rahat aralıkta tamamla.")}<br>RIR: sette yapabileceğin ilave tekrar sayısı.</p></details></div></details>`;
}
function updateProgress() {
  const rows = activeRows(),
    total = rows.reduce((a, r) => a + r.count, 0),
    done = rows.reduce(
      (a, r) =>
        a +
        Array.from(
          { length: r.count },
          (_, n) => session().entries?.[`${r.id}-${n}`],
        ).filter((e) => e?.done).length,
      0,
    );
  $("done-count").innerHTML = `${done}<span>/${total}</span>`;
  $("mobile-progress").textContent = `${done} / ${total} set tamam`;
  $("ring-value").style.strokeDashoffset =
    439.823 * (1 - (total ? done / total : 0));
  $("progress-text").textContent = session().skipped
    ? "Bu seans atlandı; kayıtların korunuyor."
    : done && done === total
      ? "Seans tamam. Emeğin kayıt altında."
      : done
        ? "İyi gidiyorsun. Kendi ritminde devam."
        : "İlk setinle başlayalım.";
  const text =
    done && done === total
      ? "Seansı gözden geçir"
      : done
        ? "Antrenmana devam et"
        : "Antrenmana başla";
  $("start-session").innerHTML = text + " ↗";
  $("mobile-start").textContent =
    done && done === total
      ? "Gözden geçir ↗"
      : done
        ? "Devam et ↗"
        : "Başla ↗";
  $("exercise-count").textContent = rows.length;
  $("exercise-meta").textContent = `${rows.length} hareket · ${total} set`;
  $("rir-target").textContent = ui.week === 1 ? "3-4" : "2-3";
  $("session-duration").textContent = DAYS[ui.day].duration;
}
function renderTraining() {
  const s = session(),
    day = DAYS[ui.day];
  $("week").value = ui.week;
  $("session-kicker").textContent =
    `${ui.week}. HAFTA / ${day.day.toLocaleUpperCase("tr")}`;
  const parts = day.title.split(" & ");
  $("workout-title").innerHTML =
    parts.length > 1
      ? `${parts[0]} <span>& ${parts[1]}.</span>`
      : `Dengeli <span>üst gövde.</span>`;
  $("workout-subtitle").textContent = day.focus;
  $("day-tabs").innerHTML = DAYS.map(
    (d, i) =>
      `<button data-day="${i}" aria-pressed="${i === ui.day}"><span class="day-number">${String(i + 1).padStart(2, "0")}</span><span><b>${d.day}</b><small>${d.title}</small></span></button>`,
  ).join("");
  $("exercise-list").innerHTML = prescription(data, ui.week, ui.day)
    .map(renderExercise)
    .join("");
  for (const field of ["date", "note", "next", "bike"])
    $(field).value = s[field] || "";
  for (const field of ["skipped", "warmup", "cooldown"])
    $(field).checked = !!s[field];
  $("legacy-bike-label").hidden = false;
  $("enable-rehab").textContent = s.rehab
    ? "Faz 2 hareketleri bu seansta açık"
    : "Bu seansa Faz 2 hareketlerini ekle ↗";
  $("enable-rehab").disabled = !!s.rehab;
  updateProgress();
}
function renderProgram() {
  $("program-days").innerHTML =
    '<div class="program-grid">' +
    DAYS.map(
      (d, i) =>
        `<section class="program-day"><div class="section-line"><span class="eyebrow">0${i + 1} / ${d.day.toLocaleUpperCase("tr")}</span><span>${d.duration}</span></div><h2>${d.title}</h2><p>${d.focus}</p><ol>${prescription(
          data,
          ui.week,
          i,
        )
          .map(
            (r) =>
              `<li><span>${esc(exerciseName(data.sessions[`${ui.week}-${i}`] || {}, r.id))}</span><strong>${r.count} × ${r.lo === r.hi ? r.lo : r.lo + "-" + r.hi}${EXERCISES[r.id].timed ? " sn" : ""}</strong></li>`,
          )
          .join(
            "",
          )}</ol><button class="text-button" data-open-day="${i}">Bu antrenmanı aç ↗</button></section>`,
    ).join("") +
    "</div>";
  $("adaptation-context").textContent =
    `${ui.week}. hafta · ${DAYS[ui.day].day}. Seçili hafta ve günün mevcut kuralları.`;
  $("ready-wrap").hidden = ui.week === 1;
  $("ready").checked = !!data.weeks[ui.week];
  $("physio-wrap").hidden = ui.day !== 2;
  $("physio").checked = !!session().physio;
  $("reduce").checked = !!session().reduce;
  $("program-rules").innerHTML =
    `<div class="program-rule"><span>01</span><div><h3>Önce tekrar, sonra ağırlık.</h3><p>Bir hareketin tüm setlerinde üst tekrar sınırına, 2-3 RIR ve düzgün formla iki uygulama üst üste ulaştığında en küçük ağırlık artışını kullan. Artıştan sonra alt tekrar sınırını tamamlayamıyorsan önceki ağırlığa dön. Setleri artırırken ağırlığı artırma. ${ui.week === 1 ? "İlk hafta tüm hareketler 2 set, RIR 3-4." : "Sonraki haftalarda hedef RIR 2-3; set artışı toparlanma seçimine bağlı."}</p></div></div><div class="program-rule"><span>02</span><div><h3>Toparlanma da programın parçası.</h3><p>Cumartesi fizyoterapi seçeneği kol hareketlerini çıkarır ve ana hareketleri 2 sete indirir. Uzayan yorgunluk seçeneği her hareketten 1 set azaltır (en az 1). Belirgin yorgunlukta seansı atla; telafi seansı ekleme. Yorgunluk 48 saati aşıyorsa veya fizyoterapiyi etkiliyorsa sonraki seansta set azaltma seçeneğini kullan. Kayıtlar korunur.</p></div></div><div class="program-rule"><span>03</span><div><h3>Mevcut sınırlarına sadık.</h3><p>Bu blok üst gövde programıdır. Faz 2 hareketleri seçilen seansa ayrıca eklenir; hocanın set ve tekrarları korunur. Bisiklet süresi seans notlarında kaydedilir. Üst gövde için fizyoterapi ve azaltma seçenekleri bacak setlerini otomatik değiştirmez. Bacakla iterek yardım etme, ağırlığı savurma veya nefesini tutma. Yeni diz ağrısı, şişlik artışı veya topallamada belirtileri tetikleyen hareketi bırakıp fizyoterapistine bildir. Dambılları yerleştirmek veya sehpaya geçmek dizini zorluyorsa yardım al ya da makineyi tercih et.</p></div></div>`;
}
function renderHistory() {
  const all = Object.entries(data.sessions).filter(
      ([, s]) =>
        recorded(s).length ||
        s.note ||
        s.next ||
        s.skipped ||
        s.date ||
        s.bike ||
        s.warmup ||
        s.cooldown,
    ),
    done = all.flatMap(([, s]) => recorded(s)).filter(([, e]) => e.done),
    volume = done.reduce(
      (n, [, e]) =>
        n +
        (e.seconds !== undefined ? 0 : Number(e.kg || 0) * Number(e.reps || 0)),
      0,
    );
  $("history-stats").innerHTML =
    `<div><strong>${all.length}</strong><span>kayıtlı seans</span></div><div><strong>${done.length}</strong><span>tamamlanan set</span></div><div><strong>${volume.toLocaleString("tr-TR")}</strong><span>kg · toplam hacim (kg × tekrar)</span></div>`;
  const filter = $("history-exercise").value,
    week = $("history-week").value;
  const list = all
    .filter(
      ([k, s]) =>
        (!week || k.startsWith(week + "-")) &&
        (!filter || recorded(s).some(([ek]) => ek.startsWith(filter + "-"))),
    )
    .sort(([a, s], [b, t]) => (t.date || b).localeCompare(s.date || a));
  $("history-list").innerHTML = list.length
    ? list
        .map(([k, s]) => {
          const [w, d] = k.split("-").map(Number),
            rows = recorded(s).filter(
              ([ek]) => !filter || ek.startsWith(filter + "-"),
            );
          return `<article class="history-session"><header><div><p class="eyebrow">${w}. HAFTA / ${DAYS[d].day.toLocaleUpperCase("tr")}</p><h2>${DAYS[d].title}</h2><p>${s.date ? esc(new Date(s.date + "T12:00:00").toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })) : "Tarih girilmedi"}${s.skipped ? " · Atlanan seans" : ""}</p></div><button class="text-button" data-history-open="${k}">Kaydı aç ↗</button></header><div class="history-rows">${[
            ...new Set(rows.map(([ek]) => ek.replace(/-\d+$/, ""))),
          ]
            .map(
              (id) =>
                `<div class="history-exercise"><h3>${esc(exerciseName(s, id))}</h3><div>${rows
                  .filter(([ek]) => ek.startsWith(id + "-"))
                  .map(
                    ([ek, e]) =>
                      `<span class="history-set ${e.done ? "completed" : ""}"><small>${Number(ek.split("-").at(-1)) + 1}.</small> ${esc(performance(e))} <small>${e.done ? "✓" : "taslak"}${e.rir ? " · RIR " + esc(e.rir) : ""}</small></span>`,
                  )
                  .join("")}</div></div>`,
            )
            .join(
              "",
            )}</div>${s.note ? `<p class="history-note">${esc(s.note)}</p>` : ""}${s.next ? `<p class="history-note">Ertesi sabah: ${esc(s.next)}</p>` : ""}${s.bike ? `<p class="history-note">Bisiklet: ${esc(s.bike)} dk</p>` : ""}</article>`;
        })
        .join("")
    : `<div class="empty-state"><span class="empty-mark">/</span><p class="eyebrow">${all.length ? "BU FİLTREDE KAYIT YOK" : "HENÜZ BİR KAYIT YOK"}</p><h2>İlk set, ilk iz.</h2><p>Girdiğin setler burada görünür. Tamamlanmamış girişlerin de taslak olarak saklanır.</p><button class="primary" data-view="training">Antrenmana dön ↗</button></div>`;
}
function showView(view, scroll = true) {
  ui.view = view;
  for (const v of ["training", "program", "history"])
    $(v + "-view").hidden = v !== view;
  document
    .querySelectorAll(".main-nav [data-view]")
    .forEach((b) =>
      b.setAttribute(
        "aria-current",
        b.dataset.view === view ? "page" : "false",
      ),
    );
  $("breadcrumb").innerHTML =
    `Günlüğüm <span>/</span> ${{ training: "Antrenman", program: "Program", history: "Geçmiş" }[view]}`;
  if (view === "program") renderProgram();
  if (view === "history") renderHistory();
  saveUI();
  if (scroll) window.scrollTo({ top: 0, behavior: "instant" });
}
function render() {
  renderTraining();
  showView(ui.view, false);
  hydrate();
  if (blocked)
    document
      .querySelectorAll(
        "main input,main textarea,main [data-alt],main [data-plus],main [data-minus],main [data-done]",
      )
      .forEach((el) => (el.disabled = true));
}
function selectSession(week, day) {
  ui.week = Number(week);
  ui.day = Number(day);
  ui.open = [DAYS[ui.day].rows[0][0]];
  saveUI();
  render();
}
function start() {
  const rows = activeRows(),
    next =
      rows.find((r) =>
        Array.from(
          { length: r.count },
          (_, n) => !session().entries?.[`${r.id}-${n}`]?.done,
        ).some(Boolean),
      ) || rows[0];
  if (!next) return;
  const el = $("exercise-" + next.id);
  el.open = true;
  el.scrollIntoView({
    block: "start",
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
  });
  const input =
    [...el.querySelectorAll(".set-row")]
      .find((r) => !r.classList.contains("is-done"))
      ?.querySelector("input") || el.querySelector("input");
  input?.focus({ preventScroll: true });
}
function download(raw, name) {
  const url = URL.createObjectURL(
      new Blob([raw], { type: "application/json" }),
    ),
    a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function exportData() {
  download(
    blocked && rawOriginal ? rawOriginal : JSON.stringify(data, null, 2),
    `${demo ? "ornek-" : " "}training-log-${new Date().toISOString().slice(0, 10)}.json`.trim(),
  );
  toast("Yedek dosyası indiriliyor.");
}
function confirm(message) {
  return new Promise((resolve) => {
    $("confirm-message").textContent = message;
    $("confirm-dialog").showModal();
    $("confirm-ok").onclick = () => {
      $("confirm-dialog").close();
      resolve(true);
    };
    $("confirm-cancel").onclick = () => {
      $("confirm-dialog").close();
      resolve(false);
    };
    $("confirm-dialog").oncancel = () => resolve(false);
  });
}
document.addEventListener("click", async (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  if (b.id === "enable-rehab") {
    if (blocked) return;
    const ok = mutate((s) => {
      s.rehab = true;
    });
    ui.open = ["legpress"];
    saveUI();
    render();
    if (ok) toast("Faz 2 hareketleri bu seansa eklendi ve cihaza kaydedildi.");
    return;
  }
  if (b.id === "apply-three-sets") {
    if (blocked) return;
    let applied = false;
    const ok = mutate(() => {
      applied = applyThreeSetSession(data, ui.week, ui.day);
    });
    render();
    if (!applied)
      toast(
        "Bu seansta kayıt veya uyarlama var. Set +/− düğmeleriyle düzenle; geçmiş hareket adı korunur.",
      );
    else if (ok)
      toast(
        "3 set, ayakta lateral raise ve ayakta pushdown cihaza kaydedildi.",
      );
    return;
  }
  if (b.id === "rehab-note") {
    if (blocked) return;
    const marker = "Diz takibi (kişisel not):";
    if (!(session().note || "").includes(marker)) {
      const template =
        "\n\n" +
        marker +
        "\nSeans öncesi ağrı (0–10): \nSeans sonrası ağrı (0–10): \nŞişlik / topallama: \nErtesi sabah yanıt: \nFizyoterapist önerisi: ";
      if ((session().note || "").length + template.length > 5000) {
        toast("Not alanı dolu. Mevcut notunu kısaltıp tekrar dene.");
        return;
      }
      const ok = mutate((s) => {
        s.note = (s.note || "") + template;
      });
      if (!ok) return;
    }
    showView("training");
    renderTraining();
    $("note").closest("details").open = true;
    $("note").focus();
    return;
  }
  if (b.dataset.view) showView(b.dataset.view);
  if (b.hasAttribute("data-settings")) $("settings-dialog").showModal();
  if (b.dataset.close) $(b.dataset.close).close();
  if (b.dataset.day !== undefined) selectSession(ui.week, b.dataset.day);
  if (b.dataset.openDay !== undefined) {
    selectSession(ui.week, b.dataset.openDay);
    showView("training");
  }
  if (b.dataset.historyOpen) {
    const [w, d] = b.dataset.historyOpen.split("-");
    selectSession(w, d);
    showView("training");
  }
  const id = b.dataset.plus || b.dataset.minus || b.dataset.resetCount;
  if (id) {
    const r = prescription(data, ui.week, ui.day).find((r) => r.id === id);
    if (blocked) return;
    mutate((s) => {
      s.setCounts ??= {};
      if (b.dataset.resetCount) delete s.setCounts[id];
      else
        s.setCounts[id] = Math.max(
          0,
          Math.min(MAX_SETS, r.count + (b.dataset.plus ? 1 : -1)),
        );
    });
    renderTraining();
    $("exercise-" + id).open = true;
    toast(
      b.dataset.minus
        ? "Set sayısı azaltıldı. Önceki girişler korundu."
        : b.dataset.plus
          ? "Bir set eklendi."
          : "Programdaki set sayısına dönüldü.",
    );
  }
  if (b.dataset.restore) {
    mutate((s) => delete s.alts[b.dataset.restore]);
    renderTraining();
  }
  if (b.dataset.done) {
    if (blocked) {
      toast("Kayıt kurtarılana kadar düzenleme kapalı.");
      return;
    }
    const ek = b.dataset.done,
      row = b.closest(".set-row"),
      inputs = [...row.querySelectorAll("input")],
      entry = session().entries?.[ek] || {},
      id = ek.replace(/-\d+$/, "");
    if (
      !entry.done &&
      ((!EXERCISES[id]?.timed && !inputs[0].value) ||
        !inputs[1].value ||
        Number(inputs[1].value) < 1 ||
        inputs.some((i) => !i.validity.valid))
    ) {
      $("error-" + id).hidden = false;
      $("error-" + id).textContent = EXERCISES[id]?.timed
        ? "En az 1 saniye gir."
        : "Ağırlığı (0 olabilir) ve en az 1 tekrarı gir.";
      inputs
        .find((i) => !i.disabled && (!i.value || !i.validity.valid))
        ?.focus();
      return;
    }
    const wasDone = !!entry.done;
    mutate((s) => {
      s.entries ??= {};
      s.entries[ek] ??= {};
      s.entries[ek].done = !s.entries[ek].done;
      if (!s.date) s.date = new Date().toLocaleDateString("en-CA");
    });
    renderTraining();
    $("exercise-" + id).open = true;
    const completedButton = $("exercise-" + id).querySelector(
      `[data-done="${ek}"]`,
    );
    completedButton?.focus({ preventScroll: true });
    if (!wasDone) completedButton?.classList.add("just-completed");
    toast(wasDone ? "Set yeniden düzenlemeye açıldı." : "Set tamamlandı.");
  }
  if (b.dataset.seconds) {
    ui.timerSeconds = Number(b.dataset.seconds);
    delete ui.timerEnd;
    ui.timerRemaining = ui.timerSeconds;
    saveUI();
    renderTimer();
  }
});
$("exercise-list").addEventListener(
  "toggle",
  (e) => {
    if (!e.target.matches(".exercise")) return;
    ui.open = [...document.querySelectorAll(".exercise[open]")].map(
      (el) => el.dataset.exercise,
    );
    saveUI();
  },
  true,
);
$("exercise-list").addEventListener("input", (e) => {
  const input = e.target;
  if (!input.dataset.field) return;
  const id = input.closest("[data-entry]").dataset.entry;
  if (!input.validity.valid || input.value.length > 20) {
    input.setAttribute("aria-invalid", "true");
    $("error-" + id.replace(/-\d+$/, "")).hidden = false;
    $("error-" + id.replace(/-\d+$/, "")).textContent =
      "Pozitif, geçerli bir sayı gir (ağırlık 0 olabilir); tekrar tam sayı olmalı. Geçersiz değer kaydedilmez.";
    return;
  }
  input.removeAttribute("aria-invalid");
  $("error-" + id.replace(/-\d+$/, "")).hidden = true;
  mutate((s) => {
    s.entries ??= {};
    s.entries[id] ??= {};
    s.entries[id][input.dataset.field] = input.value;
    if (!input.value && ["kg", "reps", "seconds"].includes(input.dataset.field))
      delete s.entries[id].done;
  });
  updateProgress();
  const done = !!session().entries?.[id]?.done;
  input.closest(".set-row").classList.toggle("is-done", done);
  const doneButton = input.closest(".set-row").querySelector("button");
  doneButton.setAttribute("aria-pressed", String(done));
  doneButton.setAttribute(
    "aria-label",
    `${exerciseName(session(), id.replace(/-\d+$/, ""))}, ${Number(id.split("-").at(-1)) + 1}. set ${done ? "tamamlandı, geri al" : "tamamla"}`,
  );
  const exEl = input.closest(".exercise"),
    r = prescription(data, ui.week, ui.day).find(
      (r) => r.id === exEl.dataset.exercise,
    );
  exEl.querySelector(".summary-count").textContent =
    Array.from(
      { length: r.count },
      (_, n) => session().entries?.[`${r.id}-${n}`],
    ).filter((e) => e?.done).length +
    "/" +
    r.count;
});
$("exercise-list").addEventListener("change", (e) => {
  if (e.target.dataset.field) {
    const el = e.target.closest(".exercise"),
      sel = el.querySelector("[data-alt]");
    if (sel) {
      sel.disabled = recorded(session()).some(([ek]) =>
        ek.startsWith(el.dataset.exercise + "-"),
      );
      if (sel.disabled)
        sel.title = "Kayıtları korumak için hareket seçimi kilitli.";
    }
    return;
  }
  if (!e.target.dataset.alt) return;
  const id = e.target.dataset.alt;
  mutate((s) => {
    s.alts ??= {};
    if (e.target.value === EXERCISES[id].name) delete s.alts[id];
    else s.alts[id] = e.target.value;
  });
  renderTraining();
});
for (const f of [
  "date",
  "note",
  "next",
  "bike",
  "skipped",
  "warmup",
  "cooldown",
  "physio",
  "reduce",
])
  $(f).addEventListener("input", (e) => {
    if (!e.target.validity.valid) return;
    mutate(
      (s) =>
        (s[f] =
          e.target.type === "checkbox" ? e.target.checked : e.target.value),
    );
    if (["physio", "reduce"].includes(f)) render();
  });
$("ready").addEventListener("change", (e) => {
  if (blocked) return;
  data.weeks[ui.week] = e.target.checked;
  persist();
  render();
});
$("week").addEventListener("change", (e) =>
  selectSession(e.target.value, ui.day),
);
$("start-session").onclick = start;
$("mobile-start").onclick = start;
$("go-history").onclick = () => showView("history");
for (const id of ["export", "export-history"]) $(id).onclick = exportData;
$("import").onclick = () => $("import-file").click();
$("history-exercise").innerHTML +=
  "<option disabled>────────</option>" +
  Object.entries(EXERCISES)
    .map(([id, e]) => `<option value="${id}">${e.name}</option>`)
    .join("");
for (const id of ["history-exercise", "history-week"])
  $(id).onchange = renderHistory;
$("import-file").onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    if (file.size > 512000) throw Error("Dosya çok büyük.");
    const next = normalize(JSON.parse(await file.text()));
    if (
      !(await confirm(
        "Bu cihazın kayıtları yüklediğin yedekle değişecek. Mevcut kayıtların ayrı bir kurtarma yedeğine alınır. Buluta bağlıysan değişiklikler eşitlenir.",
      ))
    )
      return;
    storage.setItem(
      KEY + "-before-import",
      rawOriginal || JSON.stringify(data),
    );
    data = next;
    blocked = false;
    rawOriginal = null;
    if (!persist())
      throw Error(
        "Yeni yedek cihaza yazılamadı. Sayfayı kapatmadan dışa aktar.",
      );
    render();
    $("backup-status").textContent = "Yedek yüklendi ve cihaza kaydedildi.";
  } catch (err) {
    $("backup-status").textContent = "Yüklenemedi: " + err.message;
  } finally {
    e.target.value = "";
  }
};
function renderTimer() {
  const left = ui.timerEnd
    ? Math.max(0, Math.ceil((ui.timerEnd - Date.now()) / 1000))
    : (ui.timerRemaining ?? ui.timerSeconds);
  if (ui.timerEnd && left === 0) {
    delete ui.timerEnd;
    ui.timerRemaining = 0;
    saveUI();
    toast("Dinlenme süresi doldu. Hazır olduğunda devam et.");
  }
  $("timer-display").textContent =
    `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`;
  $("timer-toggle").innerHTML = icon(ui.timerEnd ? "pause" : "play");
  $("timer-toggle").setAttribute(
    "aria-label",
    ui.timerEnd ? "Sayacı duraklat" : "Dinlenme sayacını başlat",
  );
  document
    .querySelectorAll("[data-seconds]")
    .forEach((b) =>
      b.setAttribute(
        "aria-pressed",
        Number(b.dataset.seconds) === ui.timerSeconds,
      ),
    );
}
$("timer-toggle").onclick = () => {
  if (ui.timerEnd) {
    ui.timerRemaining = Math.max(
      0,
      Math.ceil((ui.timerEnd - Date.now()) / 1000),
    );
    delete ui.timerEnd;
  } else
    ui.timerEnd = Date.now() + (ui.timerRemaining || ui.timerSeconds) * 1000;
  saveUI();
  renderTimer();
};
$("timer-reset").onclick = () => {
  delete ui.timerEnd;
  ui.timerRemaining = ui.timerSeconds;
  saveUI();
  renderTimer();
};
setInterval(renderTimer, 1000);
$("print").onclick = () => {
  $("print-content").innerHTML =
    `<h1>Training Log · 4 haftalık program</h1>${$("program-days").innerHTML}<h2>Kayıtların</h2>`;
  const v = ui.view,
    oldExercise = $("history-exercise").value,
    oldWeek = $("history-week").value;
  $("history-exercise").value = "";
  $("history-week").value = "";
  renderHistory();
  $("print-content").innerHTML += $("history-list").innerHTML;
  ui.view = v;
  $("history-exercise").value = oldExercise;
  $("history-week").value = oldWeek;
  renderHistory();
  window.print();
};
document.querySelectorAll('a[href="#training"]').forEach(
  (a) =>
    (a.onclick = (e) => {
      e.preventDefault();
      showView("training");
    }),
);
window.fitnessApp = {
  getData: () => normalize(data),
  canSync: () => !blocked && saved,
  applyData(next) {
    data = normalize(next);
    const focus = document.activeElement,
      label = focus?.getAttribute("aria-label");
    const ok = persist();
    render();
    if (label)
      [...document.querySelectorAll("input")]
        .find((i) => i.getAttribute("aria-label") === label)
        ?.focus({ preventScroll: true });
    return ok;
  },
  setStatus: status,
  isDemo: demo,
};
window.addEventListener("storage", (e) => {
  if (!demo && e.key === KEY && e.newValue) {
    blocked = true;
    $("storage-error").hidden = false;
    $("storage-error").textContent =
      "Bu günlük başka bir sekmede değişti. Üzerine yazmayı durdurduk. Gerekirse açık sekmenin yedeğini indir, ardından sayfayı yenile.";
    status("Başka sekmede değişti", "error");
    render();
  }
});
window.addEventListener("beforeunload", (e) => {
  if (!saved) {
    e.preventDefault();
    e.returnValue = "";
  }
});
$("demo-banner").hidden = !demo;
document.body.classList.toggle("demo", demo);
render();
renderTimer();
status(
  blocked ? "Kayıt okunamadı" : "Cihazda kayıtlı",
  blocked ? "error" : "local",
);
if (demo) {
  $("cloud-status").textContent =
    "Örnek görünüm: kurgusal kayıtlar yalnızca bu sekmede tutulur. Bulut bağlantısı kapalı.";
  $("cloud-login").hidden = true;
} else
  import("./sync.js").catch(() => {
    $("cloud-status").textContent =
      "Eşitleme bileşeni yüklenemedi. Yerel kayıtlar kullanılabilir; yeniden yükleyip dene.";
    status("Yalnızca bu cihazda");
  });
