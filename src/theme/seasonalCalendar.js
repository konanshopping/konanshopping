// src/theme/seasonalCalendar.js
// Calendrier saisonnier KONAN SHOPPING CAMEROUN
// Toutes les dates sont évaluées selon l'heure locale du navigateur.
// Les dates lunaires doivent être confirmées chaque année.

const pad = (value) => String(value).padStart(2, "0");

const toLocalDate = (year, month, day) =>
  new Date(year, month - 1, day, 12, 0, 0, 0);

const addDays = (date, amount) => {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
};

const isBetween = (date, start, end) =>
  date >= start && date <= end;

// Calcul de Pâques selon l'algorithme grégorien.
// Renvoie une date locale à midi pour éviter les problèmes de fuseau horaire.
function getEasterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return toLocalDate(year, month, day);
}

function getLastFridayOfNovember(year) {
  const lastDay = toLocalDate(year, 12, 1);
  lastDay.setDate(0); // dernier jour de novembre
  const offset = (lastDay.getDay() - 5 + 7) % 7;
  return addDays(lastDay, -offset);
}

// Dates lunaires : à renseigner après confirmation officielle.
// Format : "YYYY-MM-DD". Laisser null tant que la date n'est pas confirmée.
// Les bornes inclusives peuvent être ajustées pour couvrir la période commerciale.
export const lunarSeasonDates = {
  2026: {
    ramadan: { start: null, end: null },
    tabaski: { start: null, end: null },
  },
  2027: {
    ramadan: { start: null, end: null },
    tabaski: { start: null, end: null },
  },
};

function parseISODate(value) {
  if (!value || typeof value !== "string") return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const date = toLocalDate(Number(match[1]), Number(match[2]), Number(match[3]));
  if (
    date.getFullYear() !== Number(match[1]) ||
    date.getMonth() + 1 !== Number(match[2]) ||
    date.getDate() !== Number(match[3])
  ) {
    return null;
  }
  return date;
}

function getLunarRange(year, seasonId) {
  const configured = lunarSeasonDates[year]?.[seasonId];
  if (!configured?.start || !configured?.end) return null;

  const start = parseISODate(configured.start);
  const end = parseISODate(configured.end);
  if (!start || !end || end < start) return null;

  return { start, end };
}

function getFixedSeason(year, monthDayStart, monthDayEnd) {
  const [startMonth, startDay] = monthDayStart.split("-").map(Number);
  const [endMonth, endDay] = monthDayEnd.split("-").map(Number);

  return {
    start: toLocalDate(year, startMonth, startDay),
    end: toLocalDate(year, endMonth, endDay),
  };
}

function getSecondSundayOfMay(year) {
  const first = toLocalDate(year, 5, 1);
  const firstSundayOffset = (7 - first.getDay()) % 7;
  return addDays(first, firstSundayOffset + 7);
}

function getThirdSundayOfJune(year) {
  const first = toLocalDate(year, 6, 1);
  const firstSundayOffset = (7 - first.getDay()) % 7;
  return addDays(first, firstSundayOffset + 14);
}

function getSeasonRanges(year) {
  const easter = getEasterSunday(year);
  const blackFriday = getLastFridayOfNovember(year);
  const mothersDay = getSecondSundayOfMay(year);
  const fathersDay = getThirdSundayOfJune(year);

  const fixed = [
    {
      id: "new-year",
      name: "Nouvel An",
      ...getFixedSeason(year, "01-01", "01-07"),
    },
    {
      id: "valentine",
      name: "Saint-Valentin",
      ...getFixedSeason(year, "02-07", "02-15"),
    },
    {
      id: "womens-day",
      name: "Journée internationale des droits des femmes",
      ...getFixedSeason(year, "03-01", "03-09"),
    },
    {
      id: "labour-day",
      name: "Fête du Travail",
      ...getFixedSeason(year, "04-25", "05-02"),
    },
    {
      id: "cameroon-national-day",
      name: "Fête nationale du Cameroun",
      ...getFixedSeason(year, "05-15", "05-21"),
    },
    {
      id: "back-to-school",
      name: "Rentrée scolaire",
      ...getFixedSeason(year, "08-15", "09-20"),
    },
    {
      id: "halloween",
      name: "Halloween",
      ...getFixedSeason(year, "10-25", "10-31"),
    },
    {
      id: "christmas",
      name: "Noël",
      ...getFixedSeason(year, "12-01", "12-26"),
    },
  ];

  // Pâques : campagne visuelle de 7 jours avant au lundi de Pâques inclus.
  fixed.push({
    id: "easter",
    name: "Pâques",
    start: addDays(easter, -7),
    end: addDays(easter, 1),
  });

  // Black Friday : du lundi précédant le vendredi au dimanche suivant.
  fixed.push({
    id: "black-friday",
    name: "Black Friday",
    start: addDays(blackFriday, -4),
    end: addDays(blackFriday, 2),
  });

  // Fêtes familiales : campagnes courtes, calculées selon le calendrier.
  fixed.push({
    id: "mothers-day",
    name: "Fête des mères",
    start: addDays(mothersDay, -3),
    end: addDays(mothersDay, 1),
  });

  fixed.push({
    id: "fathers-day",
    name: "Fête des pères",
    start: addDays(fathersDay, -3),
    end: addDays(fathersDay, 1),
  });

  const ramadan = getLunarRange(year, "ramadan");
  const tabaski = getLunarRange(year, "tabaski");

  if (ramadan) {
    fixed.push({ id: "ramadan", name: "Ramadan", ...ramadan });
  }
  if (tabaski) {
    fixed.push({ id: "tabaski", name: "Tabaski", ...tabaski });
  }

  return fixed;
}

export function getSeasonalTheme(date = new Date()) {
  const current = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12,
    0,
    0,
    0
  );

  // Vérifier aussi les plages de l'année précédente pour les campagnes
  // qui pourraient se prolonger au-delà du 31 décembre.
  const ranges = [
    ...getSeasonRanges(current.getFullYear() - 1),
    ...getSeasonRanges(current.getFullYear()),
    ...getSeasonRanges(current.getFullYear() + 1),
  ];

  const active = ranges.find((season) =>
    isBetween(current, season.start, season.end)
  );

  return active?.id || "default";
}

export function getSeasonalThemeDetails(date = new Date()) {
  const id = getSeasonalTheme(date);
  if (id === "default") {
    return { id: "default", name: "Thème standard" };
  }

  const year = date.getFullYear();
  const season = [
    ...getSeasonRanges(year - 1),
    ...getSeasonRanges(year),
    ...getSeasonRanges(year + 1),
  ].find((item) => item.id === id && isBetween(
    new Date(year, date.getMonth(), date.getDate(), 12),
    item.start,
    item.end
  ));

  return season
    ? { id: season.id, name: season.name }
    : { id: "default", name: "Thème standard" };
}

export default getSeasonalTheme;
