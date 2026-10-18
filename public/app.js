import {
  empty,
  normalize,
  merge,
  MAX_SETS,
  MAX_WEEKS,
  DEFAULT_MAX_WEEK,
} from "./sync-core.js";
import {
  DAYS,
  EXERCISES,
  STAGES,
  WARMUP_PROTOCOL,
  getStageForWeek,
  postOpWeek,
  prescription,
} from "./program.js";
import { icon } from "./icons.js";
import { getExerciseVisual } from "./exercise-visuals.js";

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
  KEY = demo ? "fitness-demo-v4" : "upper-body-4weeks-v1",
  UIKEY = demo ? "fitness-demo-ui-v4" : "fitness-ui-v2";

const storage = {
  getItem: (key) => (demo ? sessionStorage : localStorage).getItem(key),
  setItem: (key, value) =>
    (demo ? sessionStorage : localStorage).setItem(key, value),
};

const ARCHIVE_DAY_TITLES = [
  { day: "Salı", title: "Göğüs & Sırt (Önceki Blok)" },
  { day: "Perşembe", title: "Omuz & Sırt (Önceki Blok)" },
  { day: "Cumartesi", title: "Dengeli Üst Gövde (Önceki Blok)" },
];

let data = empty(),
  rawOriginal = null,
  blocked = false,
  saved = true,
  ui = {
    week: 1,
    day: 0,
    view: "training",
    open: ["leg_press_ecc"],
    timerSeconds: 90,
    theme: "dark",
  },
  toastTimeout;

function demoData() {
  const d = empty();
  d.weeks[1] = true;
  d.criteria["rtr_balance"] = true;
  d.criteria["rtr_side_plank"] = true;
  d.sessions["1-0"] = {
    date: "2026-10-20",
    bike: "12",
    warmup: true,
    warmup_bike: true,
    warmup_slr: true,
    warmup_bridge: true,
    note: "Sağ bacak eksantrik inişlerde (3 sn) titreme belirgin şekilde azaldı. Incline DB Press leg drive olmadan çok temiz çıktı.",
    entries: {
      "leg_press_ecc-0": { kg: "25", reps: "12", rir: "2", done: true },
      "leg_press_ecc-1": { kg: "25", reps: "12", rir: "2", done: true },
      "leg_press_ecc-2": { kg: "15", reps: "10", rir: "2", done: true },
      "leg_press_ecc-3": { kg: "15", reps: "10", rir: "2", done: true },
      "incline_db_press-0": { kg: "22.5", reps: "8", rir: "2", done: true },
      "incline_db_press-1": { kg: "22.5", reps: "8", rir: "1", done: true },
    },
  };
  return d;
}

try {
  rawOriginal = storage.getItem(KEY);
  if (rawOriginal) {
    data = normalize(JSON.parse(rawOriginal));
  } else if (demo) {
    data = demoData();
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
  if (
    u &&
    Number.isInteger(u.week) &&
    u.week >= 1 &&
    u.week <= MAX_WEEKS &&
    [0, 1, 2].includes(u.day)
  ) {
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
      timerSeconds: [45, 60, 75, 90, 120].includes(u.timerSeconds)
        ? u.timerSeconds
        : 90,
      theme: ["dark", "light"].includes(u.theme) ? u.theme : "dark",
    };
    if (!ui.open.length) ui.open = [DAYS[ui.day].rows[0][0]];
    if (Number.isFinite(u.timerEnd)) ui.timerEnd = u.timerEnd;
    if (
      Number.isFinite(u.timerRemaining) &&
      u.timerRemaining >= 0 &&
      u.timerRemaining <= 180
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
function applyTheme() {
  const theme = ui.theme === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = theme;
  const meta = $("meta-theme-color");
  if (meta) meta.setAttribute("content", theme === "dark" ? "#09090b" : "#f6f5f5");
  const iconEl = $("theme-icon");
  const labelEl = $("theme-label");
  if (iconEl) iconEl.innerHTML = icon(theme === "dark" ? "sun" : "moon");
  if (labelEl)
    labelEl.textContent = theme === "dark" ? "Açık tema" : "Koyu tema";
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
  applyTheme();
}
function activeRows() {
  return prescription(data, ui.week, ui.day).filter(
    (r) => session().alts?.[r.id] !== "Bu hareketi çıkar",
  );
}
function exerciseName(s, id) {
  return s?.alts?.[id] || EXERCISES[id]?.name || id;
}
function recorded(s) {
  return Object.entries(s?.entries || {}).filter(
    ([, e]) => e && Object.keys(e).length,
  );
}
function sessionOrderKey(k) {
  if (k.startsWith("H")) {
    const [w, d] = k.slice(1).split("-").map(Number);
    return w * 3 + d - 100;
  }
  const [w, d] = k.split("-").map(Number);
  return w * 3 + d;
}
function prior(id) {
  const current = ui.week * 3 + ui.day,
    variant = exerciseName(session(), id),
    legacyId = EXERCISES[id]?.legacyId;

  // 1) Look for exact exercise match in earlier sessions of current program
  const exactMatches = Object.entries(data.sessions)
    .filter(([k, s]) => {
      if (k.startsWith("H")) return false;
      return (
        sessionOrderKey(k) < current &&
        exerciseName(s, id) === variant &&
        recorded(s).some(([ek, e]) => ek.startsWith(id + "-") && e.done)
      );
    })
    .sort(([a], [b]) => sessionOrderKey(b) - sessionOrderKey(a))
    .map(([k, s]) => ({
      key: k,
      s,
      isLegacy: false,
      entries: recorded(s).filter(
        ([ek, e]) => ek.startsWith(id + "-") && e.done,
      ),
    }));
  if (exactMatches.length) return exactMatches[0];

  // 2) Fallback to Tamer's archived historical logs (H1-0 .. H4-0) if legacyId matches
  const lookupIds = [id, ...(legacyId ? [legacyId] : [])];
  const archiveMatches = Object.entries(data.sessions)
    .filter(([k, s]) => {
      if (sessionOrderKey(k) >= current) return false;
      return recorded(s).some(
        ([ek, e]) =>
          e.done && lookupIds.some((lid) => ek.startsWith(lid + "-")),
      );
    })
    .sort(([a, sa], [b, sb]) => {
      const da = sa.date || "";
      const db = sb.date || "";
      if (da !== db) return db.localeCompare(da);
      return sessionOrderKey(b) - sessionOrderKey(a);
    })
    .map(([k, s]) => ({
      key: k,
      s,
      isLegacy: k.startsWith("H"),
      entries: recorded(s).filter(
        ([ek, e]) =>
          e.done && lookupIds.some((lid) => ek.startsWith(lid + "-")),
      ),
    }));
  return archiveMatches[0];
}

const performance = (e, id) => {
  const unit = EXERCISES[id]?.unitLabel || "tekrar";
  return `${e.kg ?? "—"} kg × ${e.reps ?? e.seconds ?? "—"} ${unit}`;
};

function renderWeekSelectors() {
  const maxW = Math.max(data.maxWeek || DEFAULT_MAX_WEEK, ui.week, 4);
  const weekEl = $("week");
  if (weekEl) {
    weekEl.innerHTML = Array.from({ length: maxW }, (_, idx) => {
      const w = idx + 1;
      const st = getStageForWeek(w);
      return `<option value="${w}" ${w === ui.week ? "selected" : ""}>${w}. hafta (Post-Op ${postOpWeek(w)}. hf · ${st.stage}. Aşama)</option>`;
    }).join("");
    weekEl.value = String(ui.week);
  }
  const histWeekEl = $("history-week");
  if (histWeekEl) {
    const prevVal = histWeekEl.value;
    histWeekEl.innerHTML =
      `<option value="">Tüm dönemler</option><option value="H">Önceki Blok (Arşiv Logları)</option>` +
      Array.from({ length: maxW }, (_, idx) => {
        const w = idx + 1;
        return `<option value="${w}">${w}. hafta (Post-Op ${postOpWeek(w)}. hf)</option>`;
      }).join("");
    if (
      prevVal === "" ||
      prevVal === "H" ||
      (Number(prevVal) >= 1 && Number(prevVal) <= maxW)
    ) {
      histWeekEl.value = prevVal;
    }
  }
}

function renderStageBanner() {
  const stage = getStageForWeek(ui.week);
  const totalCrit = stage.criteria.length;
  const doneCrit = stage.criteria.filter((c) => data.criteria?.[c.id]).length;
  const weekAlert = stage.weekAlerts?.[ui.week];

  const prevStage = STAGES.find((st) => st.stage === stage.stage - 1);
  const prevIncomplete =
    prevStage &&
    prevStage.criteria.some((c) => !data.criteria?.[c.id]);

  $("sidebar-stage-num").innerHTML =
    `0${stage.stage}<span>AKTİF AŞAMA (POST-OP ${postOpWeek(ui.week)}. HF)</span>`;
  $("sidebar-stage-caption").innerHTML =
    stage.stage === 1
      ? "Eksantrik kontrol.<br />Maksimum hipertrofi."
      : stage.stage === 2
        ? "Doğrusal koşu.<br />%80 LSI simetrisi."
        : stage.stage === 3
          ? "Çeviklik (COD).<br />Topla saha drilleri."
          : "Reaktif sprint.<br />Sahaya tam dönüş.";

  $("stage-banner").innerHTML = `
    <div class="stage-banner-main">
      <div class="stage-banner-left">
        <div class="stage-pills">
          <span class="stage-pill-active">${stage.stage}. AŞAMA</span>
          <span class="stage-pill-meta">${esc(stage.postOpRange)}</span>
          <span class="stage-pill-progress">${doneCrit}/${totalCrit} aşama kriteri tamam</span>
        </div>
        <h2>${esc(stage.title)}</h2>
        <p>${esc(stage.goal)}</p>
      </div>
      <div class="stage-banner-actions">
        <button type="button" class="secondary stage-jump-btn" data-jump-roadmap="1">
          Aşama &amp; Geçiş Kriterleri ↗
        </button>
      </div>
    </div>
    ${
      weekAlert
        ? `<div class="stage-alert" role="status"><strong>AŞAMA GEÇİŞ &amp; KİLOMETRE TAŞI BİLDİRİMİ:</strong> ${esc(weekAlert)}</div>`
        : ""
    }
    ${
      prevIncomplete
        ? `<div class="stage-alert stage-alert-warn"><strong>KLİNİK GEÇİŞ KONTROLÜ:</strong> ${prevStage.stage}. Aşama geçiş kriterlerinden bazıları henüz işaretlenmedi. Yeni aşama yüklenmelerine geçmeden önce Program &amp; Aşamalar sekmesinden tüm testleri doğruladığından emin ol.</div>`
        : ""
    }
  `;
}

function renderWarmupCard() {
  const s = session();
  const items = WARMUP_PROTOCOL.items;
  const doneCount = items.filter((it) => s[it.id] || s.warmup).length;
  $("warmup-status-badge").textContent =
    doneCount === items.length
      ? "3/3 Tamamlandı ✓"
      : `${doneCount}/${items.length} adım`;
  $("warmup-status-badge").className =
    "warmup-status" + (doneCount === items.length ? " is-complete" : "");

  $("warmup-protocol-list").innerHTML =
    `<p class="warmup-intro">${esc(WARMUP_PROTOCOL.subtitle)}</p><div class="warmup-grid">` +
    items
      .map((it) => {
        const checked = !!(s[it.id] || s.warmup);
        const vis = getExerciseVisual(it.id);
        return `
          <div class="warmup-item ${checked ? "is-done" : ""}">
            <div class="warmup-visual">${vis.svg}</div>
            <div class="warmup-item-content">
              <div class="warmup-item-head">
                <strong>${esc(it.name)}</strong>
                <span class="target-tag">${esc(it.prescription)}</span>
              </div>
              <p>${esc(it.detail)}</p>
              <label class="checkline warmup-check">
                <input type="checkbox" data-warmup-item="${it.id}" ${checked ? "checked" : ""} />
                <span>Tamamlandı</span>
              </label>
            </div>
          </div>
        `;
      })
      .join("") +
    `</div>`;
}

function renderExercise(r) {
  const s = session(),
    ex = EXERCISES[r.id],
    vis = getExerciseVisual(r.id);
  if (s.alts?.[r.id] === "Bu hareketi çıkar")
    return `<div class="removed-exercise"><span>${esc(ex.name)} · Bu seanstan çıkarıldı</span><button class="text-button" data-restore="${r.id}">Hareketi geri ekle</button></div>`;
  const last = prior(r.id),
    complete = Array.from(
      { length: r.count },
      (_, n) => s.entries?.[`${r.id}-${n}`],
    ).filter((e) => e?.done).length,
    archived = recorded(s).filter(
      ([ek]) =>
        ek.startsWith(r.id + "-") && Number(ek.split("-").at(-1)) >= r.count,
    ),
    hasEntries = recorded(s).some(([ek]) => ek.startsWith(r.id + "-")),
    unit = ex.unitLabel || "tekrar",
    repRange = r.lo === r.hi ? `${r.lo} ${unit}` : `${r.lo}-${r.hi} ${unit}`,
    perLegText = ex.perLeg ? " (Her bacak)" : "";

  const lastLabel = last
    ? last.isLegacy
      ? `ÖNCEKİ BLOK (${last.s.date || `${last.key.slice(1).split("-")[0]}. hf`})`
      : `SON SEANS (${last.key.split("-")[0]}. hafta)`
    : "";

  return `<details class="exercise" id="exercise-${r.id}" data-exercise="${r.id}" ${ui.open.includes(r.id) ? "open" : ""}>
    <summary class="exercise-summary">
      <span class="exercise-index">${String(r.index + 1).padStart(2, "0")}</span>
      <span class="summary-thumb" aria-hidden="true">${vis.svg}</span>
      <span class="exercise-name">
        <span class="exercise-badges">
          <span class="cat-badge ${ex.category === "acl" ? "cat-acl" : "cat-upper"}">${ex.category === "acl" ? "ACL · ALT GÖVDE" : "HİPERTROFİ · ÜST GÖVDE"}</span>
          <span class="rir-badge">${esc(r.rir)}</span>
        </span>
        <h3>${esc(exerciseName(s, r.id))}</h3>
        <small><strong class="tr-hint">${esc(ex.trHint || vis.turkishTitle)}</strong> <span>·</span> ${esc(ex.group)} <span>·</span> ${r.count} set × ${repRange}${perLegText}</small>
      </span>
      <span class="summary-count">${complete}/${r.count}</span>
      <span class="chevron">${icon("chevron")}</span>
    </summary>
    <div class="exercise-body">
      <div class="exercise-visual-card">
        <div class="visual-diagram">${vis.svg}</div>
        <div class="visual-meta">
          <span class="visual-kicker">HAREKET &amp; BİYOMEKANİK REHBERİ</span>
          <h4>${esc(vis.turkishTitle)}</h4>
          <p class="visual-equip">${esc(vis.equipment)}</p>
          <ul class="visual-cues">
            ${vis.cues.map((c) => `<li>${esc(c)}</li>`).join("")}
          </ul>
        </div>
      </div>
      <div class="exercise-info">
        <span class="target-tag">${r.count} set × ${repRange}${perLegText}</span>
        <span>Yoğunluk: <strong>${esc(r.rir)}</strong></span>
        <span>Tempo: <strong>${esc(r.tempo)}</strong></span>
        <button type="button" class="rest-chip" data-seconds="${r.rest}" title="Sayacı ${r.rest} saniyeye ayarla">${r.rest} sn dinlenme ⏱</button>
      </div>
      <p class="previous-line">${
        last
          ? `<span>${esc(lastLabel)}</span> <strong>${esc(performance(last.entries[0][1], r.id))}</strong> <small>${last.entries.length} set kaydı mevcut</small>`
          : `<span>İLK REFERANSIN</span> Bu hareket için tamamlanmış önceki set yok.`
      }</p>
      <div class="set-table" role="group" aria-label="${esc(exerciseName(s, r.id))} setleri">
        <div class="set-header">
          <span>SET</span>
          <span>AĞIRLIK <small>kg</small></span>
          <span>${unit === "sn" ? "SÜRE <small>sn</small>" : "TEKRAR"}</span>
          <span>RIR</span>
          <span>TAMAM</span>
        </div>
        ${Array.from({ length: r.count }, (_, n) => {
          const ek = `${r.id}-${n}`,
            e = s.entries?.[ek] || {};
          return `<div class="set-row ${e.done ? "is-done" : ""}" data-entry="${ek}">
            <span class="set-number">${String(n + 1).padStart(2, "0")}</span>
            ${["kg", "reps", "rir"]
              .map(
                (f) =>
                  `<input type="number" inputmode="${f === "reps" ? "numeric" : "decimal"}" min="0" step="${f === "reps" ? "1" : "any"}" data-field="${f}" value="${esc(e[f])}" placeholder="—" aria-label="${esc(exerciseName(s, r.id))}, ${n + 1}. set ${f === "kg" ? "ağırlık (kg)" : f === "reps" ? (unit === "sn" ? "süre (sn)" : "tekrar") : "RIR"}">`,
              )
              .join("")}
            <button class="done-button" data-done="${ek}" aria-label="${esc(exerciseName(s, r.id))}, ${n + 1}. set ${e.done ? "tamamlandı, geri al" : "tamamla"}" aria-pressed="${!!e.done}">${icon("check")}</button>
          </div>`;
        }).join("")}
      </div>
      <p class="field-error" id="error-${r.id}" role="status" hidden></p>
      <div class="set-controls">
        <button class="text-button" data-minus="${r.id}" ${r.count === 0 ? "disabled" : ""}>${icon("minus")} Set çıkar</button>
        <button class="text-button" data-plus="${r.id}" ${r.count >= MAX_SETS ? "disabled" : ""}>${icon("plus")} Set ekle</button>
        ${s.setCounts?.[r.id] !== undefined ? `<button class="reset-count" data-reset-count="${r.id}">Programdaki sayıya dön (${r.target})</button>` : ""}
      </div>
      ${
        archived.length
          ? `<details class="archived"><summary>Gizlenen ${archived.length} setin kaydı korunuyor</summary>${archived
              .map(
                ([ek, e]) =>
                  `<p>${Number(ek.split("-").at(-1)) + 1}. set · ${esc(performance(e, r.id))}${e.done ? " · Tamamlandı" : ""}</p>`,
              )
              .join("")}<p>Set ekleyerek tekrar düzenleyebilirsin.</p></details>`
          : ""
      }
      <details class="exercise-options">
        <summary>Biyomekanik uygulama notu &amp; aşama alternatifleri</summary>
        ${
          ex.alt?.length
            ? `<label>Hareket / Aşama Varyasyonu Seçimi<select data-alt="${r.id}" ${hasEntries ? "disabled" : ""}>${[
                ex.name,
                ...ex.alt,
                ...(s.alts?.[r.id] && ![ex.name, ...ex.alt].includes(s.alts[r.id])
                  ? [s.alts[r.id]]
                  : []),
              ]
                .map(
                  (n) =>
                    `<option ${exerciseName(s, r.id) === n ? "selected" : ""}>${esc(n)}</option>`,
                )
                .join("")}</select></label>`
            : ""
        }
        <p>${hasEntries && ex.alt?.length ? "Kaydın hangi harekete ait olduğunu korumak için seçim kilitli. " : ""}${esc(ex.note || "Ağırlığı kontrollü indir, hareketi güvenli aralıkta tamamla.")}<br><strong>RIR:</strong> Set sonunda formu bozmadan cepte kalan tekrar sayısı. Ana hareketlerden önce 2 kademeli ısınma seti uygula.</p>
      </details>
    </div>
  </details>`;
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
        ? "İyi gidiyorsun. Eksantrik kontrolü koru."
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
  $("exercise-meta").textContent = `${rows.length} hareket · ${total} çalışma seti`;
  $("rir-target").textContent = session().reduce ? "RIR 1-2" : "RIR 1-2 / Fail";
  $("session-duration").textContent = DAYS[ui.day].duration;
}

function renderTraining() {
  const s = session(),
    day = DAYS[ui.day],
    stage = getStageForWeek(ui.week);
  document.body.dataset.day = String(ui.day);
  renderWeekSelectors();
  renderStageBanner();
  renderWarmupCard();

  $("session-kicker").textContent =
    `${ui.week}. HAFTA (POST-OP ${postOpWeek(ui.week)}. HF · ${stage.stage}. AŞAMA) / ${day.day.toLocaleUpperCase("tr")} (${day.code})`;
  const parts = day.title.split(" & ");
  $("workout-title").innerHTML =
    parts.length > 1
      ? `${parts[0]} <span>&amp; ${parts[1]}.</span>`
      : `${esc(day.title)}`;
  $("workout-subtitle").textContent = day.focus;
  $("day-tabs").innerHTML = DAYS.map(
    (d, i) =>
      `<button data-day="${i}" aria-pressed="${i === ui.day}"><span class="day-number">0${i + 1} · ${d.code}</span><span><b>${d.day}</b><small>${d.title}</small></span></button>`,
  ).join("");
  $("exercise-list").innerHTML = prescription(data, ui.week, ui.day)
    .map(renderExercise)
    .join("");
  for (const field of ["date", "note", "next", "bike"])
    $(field).value = s[field] || "";
  for (const field of ["skipped", "warmup", "cooldown"])
    $(field).checked = !!s[field];
  updateProgress();
}

function renderProgram() {
  const stage = getStageForWeek(ui.week);
  $("program-days").innerHTML =
    '<div class="program-grid">' +
    DAYS.map(
      (d, i) =>
        `<section class="program-day"><div class="section-line"><span class="eyebrow">0${i + 1} / ${d.day.toLocaleUpperCase("tr")} (${d.code})</span><span>${d.duration}</span></div><h2>${d.title}</h2><p>${d.focus}</p><ol>${prescription(
          data,
          ui.week,
          i,
        )
          .map((r) => {
            const ex = EXERCISES[r.id];
            const unit = ex.unitLabel || "";
            const range =
              r.lo === r.hi
                ? `${r.lo}${unit ? " " + unit : ""}`
                : `${r.lo}-${r.hi}`;
            return `<li><span><strong>${esc(ex.short)}</strong><small class="prog-tr">${esc(ex.trHint)}</small></span><b>${r.target} × ${range} · ${esc(r.rir)}</b></li>`;
          })
          .join(
            "",
          )}</ol><button class="text-button" data-open-day="${i}">Bu antrenmanı aç ↗</button></section>`,
    ).join("") +
    "</div>";

  $("adaptation-context").textContent =
    `${ui.week}. hafta (Post-Op ${postOpWeek(ui.week)}. hafta · ${stage.stage}. Aşama) · ${DAYS[ui.day].day}. Seçili hafta ve günün otoregülasyon ayarları.`;
  $("ready-wrap").hidden = false;
  $("ready").checked = !!data.weeks[ui.week];
  $("physio-wrap").hidden = false;
  $("physio").checked = !!session().physio;
  $("reduce").checked = !!session().reduce;

  $("stage-roadmap").innerHTML = `
    <div class="section-line">
      <h2>4 Aşamalı Sahaya Dönüş (Return to Performance) Periyodizasyonu &amp; Geçiş Kriterleri</h2>
      <span>Aktif: ${stage.stage}. Aşama (Post-Op ${postOpWeek(ui.week)}. Hafta)</span>
    </div>
    <div class="stages-grid">
      ${STAGES.map((st) => {
        const isCurrent = st.stage === stage.stage;
        const doneCount = st.criteria.filter((c) => data.criteria?.[c.id]).length;
        return `
          <article class="stage-card ${isCurrent ? "is-active-stage" : ""}">
            <header class="stage-card-head">
              <div>
                <span class="eyebrow">${st.stage}. AŞAMA · HAFTA ${st.minWeek}–${st.maxWeek} (${esc(st.postOpRange)})</span>
                <h3>${esc(st.title)}</h3>
              </div>
              <span class="stage-score">${doneCount}/${st.criteria.length} Kriter</span>
            </header>
            <p class="stage-goal">${esc(st.goal)}</p>
            <p class="stage-next"><strong>Geçiş Kuralı:</strong> ${esc(st.nextMilestone)}</p>
            <div class="stage-criteria-box">
              <h4>${esc(st.criteriaTitle)}</h4>
              <p class="small">${esc(st.criteriaNote)}</p>
              <div class="criteria-list">
                ${st.criteria
                  .map((c) => {
                    const checked = !!data.criteria?.[c.id];
                    return `
                      <label class="criterion-row ${checked ? "is-checked" : ""}">
                        <input type="checkbox" data-criterion="${c.id}" ${checked ? "checked" : ""} />
                        <div>
                          <div class="criterion-title-line">
                            <strong>${esc(c.name)}</strong>
                            <span class="target-tag">${esc(c.target)}</span>
                          </div>
                          <small>${esc(c.desc)}</small>
                        </div>
                      </label>
                    `;
                  })
                  .join("")}
              </div>
            </div>
          </article>
        `;
      }).join("")}
    </div>
  `;

  $("program-rules").innerHTML = `
    <div class="program-rule">
      <span>01</span>
      <div>
        <h3>Güray Aydın Hipertrofi Max &amp; RIR / Failure Yoğunluk Yönetimi</h3>
        <p>Programdaki tüm setler çalışma setleridir; her ana hareketten önce kası yormadan eklemi hedef ağırlığa hazırlayan en az 2 kademeli ısınma seti zorunludur. Çok eklemli ağır bileşik hareketlerde form bozulmasını önlemek için setler <strong>RIR 1-2</strong> noktasında kesilir. Makineli/ikincil üst gövde hareketlerinde <strong>Failure</strong> (tam tükeniş), eklem riski taşımayan izole omuz/arka omuz hareketlerinde <strong>Beyond Failure</strong> (yarım tekrarlar) uygulanır. Alt gövde ACL hareketlerinde dinamik diz valgusunu önlemek için kesinlikle <strong>RIR 2-3</strong> (teknik tükeniş) korunur.</p>
      </div>
    </div>
    <div class="program-rule">
      <span>02</span>
      <div>
        <h3>Hamstring Otogrefti Koruma &amp; Biyomekanik Kurallar</h3>
        <p>Çift bacakta sağlam sol bacağın yükü domine etmesini ve sağ bacaktaki titremeyi (artrojenik kas inhibisyonu) çözmek için "2 Yukarı - 1 Aşağı" (çift bacak konsantrik, sağ bacak 3 sn eksantrik) ve tek bacak izole çalışma esastır. Kapalı zincir itişlerde (Leg Press, Box Squat) diz bükülme açısı <strong>0°–90°</strong> aralığını aşmamalıdır. Semitendinosus/gracilis grefti nedeniyle <strong>Adductor (bacak içe kapatma) makinesi kesinlikle yapılmaz</strong>. Üst gövde itişlerinde dizden kuvvet alma (leg drive) refleksi devre dışı bırakılır.</p>
      </div>
    </div>
    <div class="program-rule">
      <span>03</span>
      <div>
        <h3>Beslenme, Takviye &amp; Eklem Homeostazı (Otoregülasyon)</h3>
        <p>Günlük sabit <strong>5 gram kreatin monohidrat</strong>, antrenman içi/sonrası <strong>elektrolit</strong>, kıkırdak sinovyal sıvı difüzyonu için <strong>3,5–4 litre su</strong> ve kas protein sentezi için <strong>~170–210g protein</strong> (1.8–2.2 g/kg) hedeflenir. Sistemik aşırı yorgunlukta o haftaki Failure setleri geçici olarak RIR 1-2'ye çekilir. Alt vücut seansı sonrası dizde 24 saati aşan sıcaklık artışı, şişlik (efüzyon) veya sabah sertliği oluşursa sonraki antrenmanda alt vücut ağırlıkları <strong>%10–15</strong> düşürülür.</p>
      </div>
    </div>
  `;
}

function renderHistory() {
  renderWeekSelectors();
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
      (n, [, e]) => n + Number(e.kg || 0) * Number(e.reps || 0),
      0,
    );
  $("history-stats").innerHTML =
    `<div><strong>${all.length}</strong><span>kayıtlı seans</span></div><div><strong>${done.length}</strong><span>tamamlanan set</span></div><div><strong>${volume.toLocaleString("tr-TR")}</strong><span>kg · toplam hacim (kg × tekrar)</span></div>`;

  const filter = $("history-exercise").value,
    week = $("history-week").value;

  const matchesFilter = (ek) => {
    if (!filter) return true;
    const exId = ek.replace(/-\d+$/, "");
    if (exId === filter) return true;
    if (EXERCISES[filter]?.legacyId === exId) return true;
    return false;
  };

  const list = all
    .filter(([k, s]) => {
      const weekOk =
        !week ||
        (week === "H" ? k.startsWith("H") : k.startsWith(week + "-"));
      const exOk = !filter || recorded(s).some(([ek]) => matchesFilter(ek));
      return weekOk && exOk;
    })
    .sort(([a, s], [b, t]) => {
      const da = s.date || "";
      const db = t.date || "";
      if (da !== db) return db.localeCompare(da);
      return sessionOrderKey(b) - sessionOrderKey(a);
    });

  $("history-list").innerHTML = list.length
    ? list
        .map(([k, s]) => {
          const isArchive = k.startsWith("H");
          const [w, d] = (isArchive ? k.slice(1) : k).split("-").map(Number);
          const dayInfo = isArchive
            ? ARCHIVE_DAY_TITLES[d] || DAYS[d]
            : DAYS[d];
          const rows = recorded(s).filter(([ek]) => matchesFilter(ek));
          const kicker = isArchive
            ? `ÖNCEKİ BLOK ARŞİVİ · ${w}. HAFTA / ${dayInfo.day.toLocaleUpperCase("tr")}`
            : `${w}. HAFTA (POST-OP ${postOpWeek(w)}. HF) / ${dayInfo.day.toLocaleUpperCase("tr")}`;

          return `<article class="history-session ${isArchive ? "is-archived-session" : ""}">
            <header>
              <div>
                <p class="eyebrow">${esc(kicker)}</p>
                <h2>${esc(dayInfo.title)}</h2>
                <p>${
                  s.date
                    ? esc(
                        new Date(s.date + "T12:00:00").toLocaleDateString(
                          "tr-TR",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        ),
                      )
                    : "Tarih girilmedi"
                }${s.skipped ? " · Atlanan seans" : ""}${s.bike ? ` · Bisiklet: ${esc(s.bike)} dk` : ""}</p>
              </div>
              ${
                !isArchive
                  ? `<button class="text-button" data-history-open="${k}">Kaydı aç ↗</button>`
                  : `<span class="archive-pill">Kayıtlı Log Arşivi</span>`
              }
            </header>
            <div class="history-rows">${[
              ...new Set(rows.map(([ek]) => ek.replace(/-\d+$/, ""))),
            ]
              .map(
                (id) =>
                  `<div class="history-exercise"><h3>${esc(exerciseName(s, id))}</h3><div>${rows
                    .filter(([ek]) => ek.startsWith(id + "-"))
                    .map(
                      ([ek, e]) =>
                        `<span class="history-set ${e.done ? "completed" : ""}"><small>${Number(ek.split("-").at(-1)) + 1}.</small> ${esc(performance(e, id))} <small>${e.done ? "✓" : "taslak"}${e.rir ? " · RIR " + esc(e.rir) : ""}</small></span>`,
                    )
                    .join("")}</div></div>`,
              )
              .join("")}</div>
            ${s.note ? `<p class="history-note">${esc(s.note)}</p>` : ""}
            ${s.next ? `<p class="history-note">Ertesi sabah: ${esc(s.next)}</p>` : ""}
          </article>`;
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
    `Günlüğüm <span>/</span> ${{ training: "Antrenman", program: "Program & Aşamalar", history: "Geçmiş" }[view]}`;
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
  ui.week = Math.max(1, Math.min(MAX_WEEKS, Number(week) || 1));
  if (ui.week > (data.maxWeek || DEFAULT_MAX_WEEK)) {
    data.maxWeek = ui.week;
  }
  ui.day = Number(day);
  ui.open = [DAYS[ui.day].rows[0][0]];
  saveUI();
  render();
}

function addNewWeek() {
  if (blocked) return;
  const currentMax = Math.max(data.maxWeek || DEFAULT_MAX_WEEK, ui.week);
  if (currentMax >= MAX_WEEKS) {
    toast(`Maksimum ${MAX_WEEKS} hafta sınırına ulaşıldı.`);
    return;
  }
  data.maxWeek = currentMax + 1;
  ui.week = data.maxWeek;
  ui.open = [DAYS[ui.day].rows[0][0]];
  persist();
  saveUI();
  render();
  const st = getStageForWeek(ui.week);
  toast(
    `${ui.week}. hafta (Post-Op ${postOpWeek(ui.week)}. hf · ${st.stage}. Aşama) eklendi.`,
  );
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
    `${demo ? "ornek-" : ""}training-log-${new Date().toISOString().slice(0, 10)}.json`,
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
  if (b.id === "theme-toggle") {
    ui.theme = ui.theme === "dark" ? "light" : "dark";
    applyTheme();
    saveUI();
    toast(ui.theme === "dark" ? "Koyu tema aktif." : "Açık tema aktif.");
    return;
  }
  if (b.id === "add-week" || b.id === "program-add-week") {
    addNewWeek();
    return;
  }
  if (b.dataset.jumpRoadmap) {
    showView("program");
    setTimeout(() => {
      $("stage-roadmap")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
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
      (!inputs[0].value ||
        !inputs[1].value ||
        Number(inputs[1].value) < 1 ||
        inputs.some((i) => !i.validity.valid))
    ) {
      $("error-" + id).hidden = false;
      $("error-" + id).textContent =
        "Ağırlığı (0 olabilir) ve en az 1 tekrarı/süreyi gir.";
      inputs.find((i) => !i.value || !i.validity.valid)?.focus();
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
    toast(`Dinlenme sayacı ${ui.timerSeconds} saniyeye ayarlandı.`);
  }
});

document.addEventListener("change", (e) => {
  const t = e.target;
  if (t.dataset?.warmupItem) {
    if (blocked) return;
    const itemId = t.dataset.warmupItem;
    mutate((s) => {
      if (t.checked) s[itemId] = true;
      else delete s[itemId];
      const allDone = WARMUP_PROTOCOL.items.every((it) => s[it.id]);
      if (allDone) s.warmup = true;
    });
    renderTraining();
    return;
  }
  if (t.dataset?.criterion) {
    if (blocked) return;
    const cid = t.dataset.criterion;
    data.criteria ??= {};
    if (t.checked) data.criteria[cid] = true;
    else delete data.criteria[cid];
    persist();
    renderStageBanner();
    if (ui.view === "program") renderProgram();
    toast(
      t.checked
        ? "Klinik aşama kriteri tamamlandı olarak işaretlendi."
        : "Kriter işareti kaldırıldı.",
    );
    return;
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
    if (!input.value && ["kg", "reps"].includes(input.dataset.field))
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
    if (["physio", "reduce", "warmup"].includes(f)) render();
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
  "<option disabled>── Yeni Program Hareketleri ──</option>" +
  Object.entries(EXERCISES)
    .filter(([id]) => !["chest", "row", "lat", "lateral", "preacher", "triceps", "shoulder", "fly", "reverse", "hammer"].includes(id))
    .map(([id, e]) => `<option value="${id}">${e.name}</option>`)
    .join("") +
  "<option disabled>── Önceki Blok (Arşiv) Hareketleri ──</option>" +
  ["chest", "row", "lat", "lateral", "preacher", "triceps"]
    .map((id) => `<option value="${id}">${EXERCISES[id].name}</option>`)
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
        "Bu cihazın kayıtları yüklediğin yedekle birleştirilecek/güncellenecek. Mevcut kayıtların ayrı bir kurtarma yedeğine alınır. Buluta bağlıysan değişiklikler eşitlenir.",
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
    .querySelectorAll(".timer-choices [data-seconds]")
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
    `<h1>Training Log · ACL &amp; Güray Aydın Hipertrofi Programı</h1>${$("program-days").innerHTML}<h2>Kayıtların</h2>`;
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
