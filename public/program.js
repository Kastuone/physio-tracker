// Exercise prescription preserved from the existing tracker.
export const EXERCISES = {
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
    alt: [],
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
    alt: ["Triceps Extension Machine", "Bu hareketi çıkar"],
    note: "Sabit sehpayla güvenli kurulum varsa. Uygun kurulum ve alternatif yoksa hareketi çıkar.",
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
  return DAYS[day].rows
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
}
