// Exercise prescription preserved from the existing tracker.
export const EXERCISES = {
  legpress: {
    name: "Leg Press",
    short: "Leg Press",
    group: "Faz 2 · Bacak",
    alt: [],
    rehab: true,
    note: "Hocanın planı: 3 × 12. Yük ve diz açısı belirtilmedi; fizyoterapistinle belirle. Ağrılı son açıyı zorlamadan çalış.",
  },
  legcurl: {
    name: "Leg Curl",
    short: "Leg Curl",
    group: "Faz 2 · Bacak",
    alt: [],
    rehab: true,
    note: "Hocanın planı: 3 × 12. Hamstring greftine uygun yük ve hareket aralığını tedavi ekibinle netleştir. Bu kayıt alanı klinik onay değildir.",
  },
  stepup: {
    name: "Alçak Basamak Step-up",
    short: "Step-up",
    group: "Faz 2 · Bacak",
    alt: [],
    rehab: true,
    note: "Hocanın planı: 3 × 10. Basamak yüksekliği ve hangi tarafın çalışacağı belirtilmedi; hocanla netleştir, tarafı seans notuna yaz. Ek ağırlık yoksa 0 kg gir.",
  },
  bridge: {
    name: "Glute Bridge",
    short: "Glute Bridge",
    group: "Faz 2 · Bacak",
    alt: [],
    rehab: true,
    note: "Hocanın planı: 3 × 15. Tek/çift bacak ayrımı belirtilmedi; videodan yeni varyant ekleme. Ek ağırlık yoksa 0 kg gir.",
  },
  balance: {
    name: "Tek Ayak Denge",
    short: "Tek Ayak Denge",
    group: "Faz 2 · Denge",
    alt: [],
    rehab: true,
    timed: true,
    note: "Hocanın planı: 3 × 30 saniye. Süreyi saniye olarak kaydet. Taraf, zemin ve destek şeklini hocanla netleştir; bunları seans notuna yaz.",
  },

  chest: {
    name: "Seated Machine Chest Press",
    short: "Chest Press",
    group: "Göğüs",
    alt: ["Dumbbell Bench Press"],
  },
  row: {
    name: "Chest-Supported Machine Row",
    short: "Supported Row",
    group: "Sırt",
    alt: ["Incline Bench Chest-Supported Dumbbell Row"],
  },
  lat: {
    name: "Lat Pulldown",
    short: "Lat Pulldown",
    group: "Sırt",
    alt: ["Chest-Supported Machine Row"],
    note: "Barı önüne çek. Row alternatifi dikey çekişin birebir karşılığı değildir.",
  },
  lateral: {
    name: "Seated Dumbbell Lateral Raise",
    short: "Lateral Raise",
    group: "Omuz",
    alt: ["Standing Dumbbell Lateral Raise"],
    note: "Ayakta varyantta gövdeyi savurma; dizinden destek alarak ağırlığı itme.",
  },
  preacher: {
    name: "Preacher Curl",
    short: "Preacher Curl",
    group: "Biceps",
    alt: ["Seated Dumbbell Curl"],
  },
  triceps: {
    name: "Seated Cable Triceps Pushdown",
    short: "Triceps Pushdown",
    group: "Triceps",
    alt: [
      "Standing Cable Triceps Pushdown",
      "Triceps Extension Machine",
      "Bu hareketi çıkar",
    ],
    note: "Oturarak veya ayakta cable pushdown seçebilirsin. Ayakta gövdeyi sabit tut; bacakla itme. Baş üstü triceps extension ayrı bir harekettir.",
  },
  shoulder: {
    name: "Seated Machine Shoulder Press",
    short: "Shoulder Press",
    group: "Omuz",
    alt: ["Seated Dumbbell Shoulder Press"],
    note: "Dambıl alternatifinde sırt destekli sehpa kullan.",
  },
  fly: {
    name: "Pec Deck Fly / Machine Chest Fly",
    short: "Pec Deck Fly",
    group: "Göğüs",
    alt: ["Dumbbell Bench Press"],
  },
  reverse: {
    name: "Reverse Pec Deck / Machine Reverse Fly",
    short: "Reverse Fly",
    group: "Arka omuz",
    alt: ["Incline Bench Chest-Supported Dumbbell Row"],
    note: "Row alternatifi aynı hareket değildir; destekli sırt çalışması olarak kullanılır.",
  },
  hammer: {
    name: "Seated Dumbbell Hammer Curl",
    short: "Hammer Curl",
    group: "Biceps",
    alt: [],
  },
};
export const DAYS = [
  {
    day: "Salı",
    title: "Göğüs & sırt",
    focus: "Chest Press ve Row öncelikli.",
    duration: "60-75 dk",
    rows: [
      ["chest", 3, 8, 12],
      ["row", 3, 8, 12],
      ["lat", 2, 10, 12],
      ["lateral", 2, 12, 15],
      ["preacher", 2, 10, 15],
      ["triceps", 2, 10, 15],
    ],
  },
  {
    day: "Perşembe",
    title: "Omuz & sırt",
    focus: "Omuz itişi, destekli sırt ve arka omuz.",
    duration: "60-75 dk",
    rows: [
      ["shoulder", 3, 8, 12],
      ["row", 3, 10, 12],
      ["fly", 2, 10, 15],
      ["reverse", 2, 12, 15],
      ["hammer", 2, 10, 15],
      ["triceps", 2, 10, 15],
    ],
  },
  {
    day: "Cumartesi",
    title: "Dengeli üst gövde",
    focus: "Lat Pulldown öncelikli, daha düşük hacim.",
    duration: "50-65 dk",
    rows: [
      ["lat", 2, 10, 12],
      ["chest", 2, 10, 12],
      ["row", 2, 10, 12],
      ["lateral", 2, 12, 15],
      ["preacher", 2, 10, 15],
      ["triceps", 2, 10, 15],
    ],
  },
];
export function prescription(data, week, day) {
  const s = data.sessions[`${week}-${day}`] || {};
  const upper = DAYS[day].rows
    .map(([id, sets, lo, hi], index) => {
      const target = Math.max(
        1,
        (week === 1 || !data.weeks[week] || (day === 2 && s.physio)
          ? 2
          : sets) - (s.reduce ? 1 : 0),
      );
      return {
        id,
        lo,
        hi,
        index,
        target,
        count: s.setCounts?.[id] ?? target,
        rest: index < 3 ? "90-120" : "60-90",
      };
    })
    .filter(
      (r) => !(day === 2 && s.physio && ["preacher", "triceps"].includes(r.id)),
    );
  const legs = [
    ["legpress", 12],
    ["legcurl", 12],
    ["stepup", 10],
    ["bridge", 15],
    ["balance", 30],
  ];
  return upper.concat(
    legs
      .filter(
        ([id]) =>
          s.rehab ||
          Object.keys(s.entries || {}).some((k) => k.startsWith(id + "-")),
      )
      .map(([id, reps], index) => ({
        id,
        lo: reps,
        hi: reps,
        target: 3,
        count: s.setCounts?.[id] ?? 3,
        index: DAYS[day].rows.length + index,
        rest: "",
      })),
  );
}

// Explicit per-session adoption. Never re-label or overwrite an existing session.
export function applyThreeSetSession(data, week, day) {
  const key = `${week}-${day}`;
  if (!/^[1-4]-[0-2]$/.test(key)) return false;
  const existing = data.sessions[key];
  if (
    existing &&
    Object.values(existing).some(
      (v) => v && (typeof v !== "object" || Object.keys(v).length),
    )
  )
    return false;
  data.sessions[key] = {
    setCounts: Object.fromEntries(DAYS[day].rows.map(([id]) => [id, 3])),
    alts: Object.fromEntries(
      DAYS[day].rows
        .filter(([id]) => ["lateral", "triceps"].includes(id))
        .map(([id]) => [
          id,
          id === "lateral"
            ? "Standing Dumbbell Lateral Raise"
            : "Standing Cable Triceps Pushdown",
        ]),
    ),
  };
  return true;
}
