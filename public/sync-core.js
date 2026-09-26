// v2 accepts every v1 record; setCounts never deletes recorded sets.
export const MAX_SETS = 20;
export const empty = () => ({ version: 2, weeks: {}, sessions: {} });
const ids = [
  ["chest", "row", "lat", "lateral", "preacher", "triceps"],
  ["shoulder", "row", "fly", "reverse", "hammer", "triceps"],
  ["chest", "lat", "row", "lateral", "preacher", "triceps"],
];
const object = (v) => v && typeof v === "object" && !Array.isArray(v);
export function normalize(raw) {
  if (
    !raw ||
    ![1, 2].includes(raw.version) ||
    !object(raw.sessions) ||
    !object(raw.weeks)
  )
    throw Error("Kayıt biçimi geçersiz.");
  const out = empty();
  for (let w = 1; w <= 4; w++) {
    if (raw.weeks[w] === true) out.weeks[w] = true;
    for (let d = 0; d < 3; d++) {
      const key = `${w}-${d}`,
        s = raw.sessions[key];
      if (!s) continue;
      if (!object(s)) throw Error("Seans biçimi geçersiz.");
      const t = { entries: {}, alts: {}, setCounts: {} };
      for (const field of ["date", "bike", "note", "next"]) {
        const v = s[field];
        if (v === undefined || v === "") continue;
        if (typeof v !== "string" || v.length > 5000)
          throw Error("Kayıt alanı geçersiz.");
        t[field] = v;
      }
      for (const field of ["physio", "reduce", "warmup", "cooldown", "skipped"])
        if (s[field] === true) t[field] = true;
      for (const id of ids[d]) {
        const alt = s.alts?.[id];
        if (alt) {
          if (typeof alt !== "string" || alt.length > 160)
            throw Error("Hareket adı geçersiz.");
          t.alts[id] = alt;
        }
        const count = s.setCounts?.[id];
        if (count !== undefined) {
          if (!Number.isInteger(count) || count < 0 || count > MAX_SETS)
            throw Error("Set sayısı geçersiz.");
          t.setCounts[id] = count;
        }
        for (let n = 0; n < MAX_SETS; n++) {
          const ek = `${id}-${n}`,
            v = s.entries?.[ek];
          if (!v) continue;
          const e = {};
          for (const f of ["kg", "reps", "rir"]) {
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
      for (const ek of Object.keys(s.entries || {})) {
        const m = /^(.+)-(\d+)$/.exec(ek);
        if (!m || !ids[d].includes(m[1]) || Number(m[2]) >= MAX_SETS)
          throw Error(
            "Desteklenmeyen set kaydı. İçe aktarma durduruldu; dosyan korunuyor.",
          );
      }
      for (const f of ["entries", "alts", "setCounts"])
        if (!Object.keys(t[f]).length) delete t[f];
      if (Object.keys(t).length) out.sessions[key] = t;
    }
  }
  for (const k of Object.keys(raw.sessions))
    if (!/^[1-4]-[0-2]$/.test(k))
      throw Error("Desteklenmeyen seans. İçe aktarma durduruldu.");
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
  const root = empty();
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
    const bv = b.get(k),
      lv = l.get(k),
      rv = r.get(k),
      lc = lv !== bv,
      rc = rv !== bv;
    const conflict = lc && rc && lv !== rv;
    if (conflict) conflicts.push(JSON.parse(k));
    const value = conflict ? (choice === "remote" ? rv : lv) : lc ? lv : rv;
    if (value !== undefined) out.set(k, value);
  }
  return { data: inflate(out), conflicts };
}
