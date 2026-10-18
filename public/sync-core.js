// Schema v4: Supports unlimited weeks (1..52), 4-stage RTP clinical criteria,
// all new ACL + Güray Aydın exercises, and preserves Tamer's historical logs.

export const MAX_SETS = 20;
export const MAX_WEEKS = 52;
export const DEFAULT_MAX_WEEK = 22; // Covers Post-Op Week 11 (Week 1) through Post-Op Week 32 (Week 22, March Return to Play)

export const LEGACY_IDS = [
  "chest",
  "row",
  "lat",
  "lateral",
  "preacher",
  "triceps",
  "shoulder",
  "fly",
  "reverse",
  "hammer",
];

export const PROGRAM_IDS = [
  // Day A (Salı)
  "leg_press_ecc",
  "step_up",
  "leg_curl_21",
  "hip_abductor",
  "incline_db_press",
  "cable_cross_fly",
  "seated_ohp",
  "seated_lat_raise",
  "rope_pushdown",
  // Day B (Perşembe)
  "db_rdl",
  "uni_leg_curl",
  "ecc_step_down",
  "single_calf_raise",
  "wide_lat_pulldown",
  "supported_row",
  "rope_pullover",
  "reverse_pec_deck",
  "preacher_curl",
  // Day C (Cumartesi)
  "goblet_box_squat",
  "chair_bridge",
  "iso_leg_press",
  "balance_side_plank",
  "flat_chest_press",
  "close_pulldown",
  "cable_lat_raise",
  "arm_superset",
];

export const ALL_EXERCISE_IDS = new Set([...PROGRAM_IDS, ...LEGACY_IDS]);

// Tamer's recorded historical sessions from training-log-2026-10-18.json,
// preserved as default archived history ("H1-0" .. "H4-1").
export const DEFAULT_HISTORY_SESSIONS = {
  "H1-0": {
    entries: {
      "chest-0": { kg: "45", reps: "10", rir: "2", done: true },
      "chest-1": { kg: "45", reps: "10", rir: "1", done: true },
      "row-0": { kg: "10", reps: "10", rir: "2", done: true },
      "row-1": { kg: "10", reps: "10", rir: "2", done: true },
      "lat-0": { kg: "35", reps: "10", rir: "2", done: true },
      "lat-1": { kg: "45", reps: "10", rir: "0", done: true },
      "lateral-0": { kg: "5", reps: "12", rir: "1", done: true },
      "lateral-1": { kg: "5", reps: "12", rir: "1", done: true },
      "preacher-0": { kg: "15", reps: "10", rir: "1", done: true },
      "preacher-1": { kg: "15", reps: "10", rir: "1", done: true },
      "triceps-0": { kg: "20", reps: "12", rir: "1", done: true },
      "triceps-1": { kg: "20", reps: "12", rir: "1", done: true },
    },
    date: "2026-09-15",
    bike: "15",
    warmup: true,
    cooldown: true,
  },
  "H1-2": {
    entries: {
      "chest-0": { kg: "50", reps: "10", rir: "1", done: true },
      "chest-1": { kg: "50", reps: "10", rir: "1", done: true },
      "lat-0": { kg: "45", reps: "10", rir: "2", done: true },
      "lat-1": { kg: "45", reps: "10", rir: "1", done: true },
      "row-0": { kg: "12.5", reps: "10", rir: "2", done: true },
      "row-1": { kg: "12.5", reps: "10", rir: "1", done: true },
      "lateral-0": { kg: "5", reps: "10", rir: "2", done: true },
      "lateral-1": { kg: "5", reps: "10", rir: "1", done: true },
      "preacher-0": { kg: "15", reps: "10", rir: "1", done: true },
      "preacher-1": { kg: "15", reps: "10", rir: "0", done: true },
      "triceps-0": { kg: "20", reps: "10", rir: "2", done: true },
      "triceps-1": { kg: "25", reps: "10", rir: "1", done: true },
    },
    date: "2026-06-12",
    bike: "12.5",
    warmup: true,
    cooldown: true,
  },
  "H2-0": {
    entries: {
      "chest-0": { kg: "55", reps: "10", rir: "2", done: true },
      "chest-1": { kg: "55", reps: "10", rir: "2", done: true },
      "chest-2": { kg: "55", reps: "10", rir: "2", done: true },
      "row-0": { kg: "15", reps: "10", rir: "2", done: true },
      "row-1": { kg: "15", reps: "10", rir: "2", done: true },
      "row-2": { kg: "15", reps: "10", rir: "2", done: true },
      "lat-0": { kg: "45", reps: "10", rir: "2", done: true },
      "lat-1": { kg: "45", reps: "10", rir: "2", done: true },
      "lateral-0": { kg: "7", reps: "12", rir: "2", done: true },
      "lateral-1": { kg: "7", reps: "12", rir: "2", done: true },
      "preacher-0": { kg: "15", reps: "10", rir: "1", done: true },
      "preacher-1": { kg: "15", reps: "10", rir: "0", done: true },
      "triceps-0": { kg: "20", reps: "12", rir: "2", done: true },
      "triceps-1": { kg: "20", reps: "12", rir: "1", done: true },
    },
    date: "2026-09-15",
    bike: "15",
    warmup: true,
    cooldown: true,
  },
  "H3-2": {
    entries: {
      "chest-0": { kg: "60", reps: "10", rir: "2", done: true },
      "chest-1": { kg: "60", reps: "10", rir: "2", done: true },
      "chest-2": { kg: "60", reps: "10", rir: "2", done: true },
      "lat-0": { kg: "45", reps: "10", rir: "3", done: true },
      "lat-1": { kg: "45", reps: "10", rir: "1", done: true },
      "lat-2": { kg: "45", reps: "5", rir: "0", done: true },
      "row-0": { kg: "17.5", reps: "10", rir: "1", done: true },
      "row-1": { kg: "17.5", reps: "10", rir: "2", done: true },
      "row-2": { kg: "17.5", reps: "10", rir: "1", done: true },
      "lateral-0": { kg: "7", reps: "12", rir: "2", done: true },
      "lateral-1": { kg: "7", reps: "12", rir: "1", done: true },
      "lateral-2": { kg: "7", reps: "12", rir: "1", done: true },
      "preacher-0": { kg: "15", reps: "10", rir: "1", done: true },
      "preacher-1": { kg: "15", reps: "8", rir: "0", done: true },
      "preacher-2": { kg: "10", reps: "10", rir: "1", done: true },
      "triceps-0": { kg: "25", reps: "12", rir: "2", done: true },
      "triceps-1": { kg: "25", reps: "12", rir: "2", done: true },
      "triceps-2": { kg: "25", reps: "12", rir: "2", done: true },
    },
    setCounts: {
      chest: 3,
      lat: 3,
      row: 3,
      lateral: 3,
      preacher: 3,
      triceps: 3,
    },
    date: "2026-09-26",
    warmup: true,
  },
  "H4-0": {
    entries: {
      "chest-0": { kg: "65", reps: "10", rir: "2", done: true },
      "chest-1": { kg: "65", reps: "10", rir: "1", done: true },
      "chest-2": { kg: "65", reps: "10", rir: "0", done: true },
      "row-0": { kg: "20", reps: "10", rir: "2", done: true },
      "row-1": { kg: "20", reps: "10", rir: "1", done: true },
      "row-2": { kg: "20", reps: "10", rir: "0", done: true },
      "lateral-0": { kg: "12.5", reps: "6", rir: "0", done: true },
      "lateral-1": { kg: "10", reps: "6", rir: "0", done: true },
      "lateral-2": { kg: "7.5", reps: "10", rir: "0", done: true },
      "lateral-3": { kg: "7", reps: "12", rir: "0", done: true },
      "preacher-0": { kg: "10", reps: "10", rir: "2", done: true },
      "preacher-1": { kg: "15", reps: "10", rir: "1", done: true },
      "preacher-2": { kg: "15", reps: "10", rir: "0", done: true },
      "triceps-0": { kg: "25", reps: "12", rir: "2", done: true },
      "triceps-1": { kg: "25", reps: "12", rir: "1", done: true },
      "triceps-2": { kg: "25", reps: "12", rir: "0", done: true },
    },
    setCounts: {
      chest: 3,
      row: 3,
      lateral: 4,
      preacher: 3,
      triceps: 3,
    },
    date: "2026-09-29",
    warmup: true,
    cooldown: true,
  },
  "H4-1": {
    date: "2026-09-29",
    warmup: true,
    cooldown: true,
  },
};

export const empty = ({ withDefaultHistory = true } = {}) => ({
  version: 4,
  maxWeek: DEFAULT_MAX_WEEK,
  weeks: {},
  criteria: {},
  sessions: withDefaultHistory ? structuredClone(DEFAULT_HISTORY_SESSIONS) : {},
});

const object = (v) => v && typeof v === "object" && !Array.isArray(v);

function isLegacyOnlySession(s) {
  if (!object(s)) return false;
  const entryKeys = Object.keys(s.entries || {});
  const countKeys = Object.keys(s.setCounts || {});
  const altKeys = Object.keys(s.alts || {});
  const exIds = [
    ...entryKeys.map((k) => k.replace(/-\d+$/, "")),
    ...countKeys,
    ...altKeys,
  ];
  if (exIds.some((id) => PROGRAM_IDS.includes(id))) return false;
  if (exIds.some((id) => LEGACY_IDS.includes(id))) return true;
  if (s.date && s.date <= "2026-10-05") return true;
  return false;
}

function normalizeSession(s) {
  if (!object(s)) throw Error("Seans biçimi geçersiz.");
  const t = { entries: {}, alts: {}, setCounts: {} };
  for (const field of ["date", "bike", "note", "next"]) {
    const v = s[field];
    if (v === undefined || v === "") continue;
    if (typeof v !== "string" || v.length > 5000)
      throw Error("Kayıt alanı geçersiz.");
    t[field] = v;
  }
  for (const field of [
    "physio",
    "reduce",
    "warmup",
    "cooldown",
    "skipped",
    "warmup_bike",
    "warmup_slr",
    "warmup_bridge",
  ]) {
    if (s[field] === true) t[field] = true;
  }
  if (object(s.alts)) {
    for (const [id, alt] of Object.entries(s.alts)) {
      if (!ALL_EXERCISE_IDS.has(id)) continue;
      if (typeof alt !== "string" || alt.length > 160)
        throw Error("Hareket adı geçersiz.");
      t.alts[id] = alt;
    }
  }
  if (object(s.setCounts)) {
    for (const [id, count] of Object.entries(s.setCounts)) {
      if (!ALL_EXERCISE_IDS.has(id)) continue;
      if (!Number.isInteger(count) || count < 0 || count > MAX_SETS)
        throw Error("Set sayısı geçersiz.");
      t.setCounts[id] = count;
    }
  }
  if (object(s.entries)) {
    for (const [ek, v] of Object.entries(s.entries)) {
      const m = /^([a-z0-9_]+)-(\d+)$/.exec(ek);
      if (!m || !ALL_EXERCISE_IDS.has(m[1]) || Number(m[2]) >= MAX_SETS) {
        throw Error(
          "Desteklenmeyen set kaydı. İçe aktarma durduruldu; dosyan korunuyor.",
        );
      }
      if (!object(v)) continue;
      const e = {};
      for (const f of ["kg", "reps", "rir", "seconds"]) {
        if (v[f] === undefined || v[f] === "") continue;
        if (
          typeof v[f] !== "string" ||
          v[f].length > 20 ||
          !Number.isFinite(Number(v[f])) ||
          Number(v[f]) < 0
        )
          throw Error("Set değeri geçersiz.");
        e[f] = v[f];
      }
      if (v.done === true) e.done = true;
      if (Object.keys(e).length) t.entries[ek] = e;
    }
  }
  for (const f of ["entries", "alts", "setCounts"])
    if (!Object.keys(t[f]).length) delete t[f];
  return t;
}

export function normalize(raw) {
  if (
    !raw ||
    ![1, 2, 3, 4].includes(raw.version) ||
    !object(raw.sessions) ||
    !object(raw.weeks)
  )
    throw Error("Kayıt biçimi geçersiz.");

  const out = empty({ withDefaultHistory: true });

  if (
    raw.maxWeek !== undefined &&
    Number.isInteger(raw.maxWeek) &&
    raw.maxWeek >= 1 &&
    raw.maxWeek <= MAX_WEEKS
  ) {
    out.maxWeek = raw.maxWeek;
  }

  for (let w = 1; w <= MAX_WEEKS; w++) {
    if (raw.weeks[w] === true) out.weeks[w] = true;
  }

  if (object(raw.criteria)) {
    for (const [cid, val] of Object.entries(raw.criteria)) {
      if (typeof cid === "string" && cid.length <= 64 && val === true) {
        out.criteria[cid] = true;
      }
    }
  }

  for (const [k, s] of Object.entries(raw.sessions)) {
    if (!s) continue;
    const isArchiveKey = /^H[1-4]-[0-2]$/.test(k);
    const activeMatch = /^([1-9]|[1-4][0-9]|5[0-2])-([0-2])$/.exec(k);
    if (!isArchiveKey && !activeMatch) {
      throw Error("Desteklenmeyen seans. İçe aktarma durduruldu.");
    }
    const norm = normalizeSession(s);
    if (!Object.keys(norm).length) continue;

    if (isArchiveKey) {
      out.sessions[k] = norm;
      continue;
    }

    const w = Number(activeMatch[1]);
    if (w > out.maxWeek) out.maxWeek = w;

    // If importing a v3 personal backup (e.g. training-log-2026-10-18.json) where weeks 1-4
    // contain the September/June legacy block, preserve them in the H1..H4 archive slots
    // so Week 1..4 of the new ACL + Hypertrophy program remain clean for new sessions.
    if (
      raw.version === 3 &&
      w <= 4 &&
      isLegacyOnlySession(norm) &&
      (norm.date || k === "3-0")
    ) {
      if (k !== "3-0") out.sessions[`H${k}`] = norm;
    } else {
      out.sessions[k] = norm;
    }
  }

  return out;
}

const flatten = (obj, prefix = [], out = new Map()) => {
  for (const [k, v] of Object.entries(obj)) {
    const p = [...prefix, k];
    if (v && typeof v === "object") flatten(v, p, out);
    else out.set(JSON.stringify(p), v);
  }
  return out;
};

function inflate(map) {
  const root = empty({ withDefaultHistory: false });
  for (const [key, value] of map) {
    const path = JSON.parse(key);
    let p = root;
    for (const part of path.slice(0, -1)) p = p[part] || (p[part] = {});
    p[path.at(-1)] = value;
  }
  return normalize(root);
}

export const same = (a, b) =>
  JSON.stringify(normalize(a)) === JSON.stringify(normalize(b));

export function merge(base, local, remote, choice) {
  const b = flatten(normalize(base)),
    l = flatten(normalize(local)),
    r = flatten(normalize(remote)),
    out = new Map(),
    conflicts = [];
  for (const k of new Set([...b.keys(), ...l.keys(), ...r.keys()])) {
    const path = JSON.parse(k);
    if (path[0] === "version") {
      out.set(k, 4);
      continue;
    }
    if (path[0] === "maxWeek") {
      const maxW = Math.max(
        Number(b.get(k) || DEFAULT_MAX_WEEK),
        Number(l.get(k) || DEFAULT_MAX_WEEK),
        Number(r.get(k) || DEFAULT_MAX_WEEK),
      );
      out.set(k, maxW);
      continue;
    }
    const bv = b.get(k),
      lv = l.get(k),
      rv = r.get(k),
      lc = lv !== bv,
      rc = rv !== bv;
    const conflict = lc && rc && lv !== rv;
    if (conflict) conflicts.push(path);
    const value = conflict ? (choice === "remote" ? rv : lv) : lc ? lv : rv;
    if (value !== undefined) out.set(k, value);
  }
  return { data: inflate(out), conflicts };
}
