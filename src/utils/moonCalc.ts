import { FullMoon, SkyPosition } from '../types';
import { FULL_MOONS_2026 } from '../data/moons';

export const LUNAR_MONTH_DAYS = 29.53058770576;

const LUNAR_PHASE_NAMES = [
  "New Moon",
  "Waxing Crescent",
  "First Quarter",
  "Waxing Gibbous",
  "Full Moon",
  "Waning Gibbous",
  "Last Quarter",
  "Waning Crescent"
];

export function getLunarAgePercent(date: Date = new Date()): number {
  const julianDate = date.getTime() / 86400000 - date.getTimezoneOffset() / 1440 + 2440587.5;
  let percent = ((julianDate - 2451550.1) / LUNAR_MONTH_DAYS) % 1;
  if (percent < 0) percent += 1;
  return percent;
}

export function getLunarAge(date: Date = new Date()): number {
  return getLunarAgePercent(date) * LUNAR_MONTH_DAYS;
}

const TRADITIONAL_FULL_MOON_NAMES: Record<number, string> = {
  0: "Wolf Moon",
  1: "Snow Moon",
  2: "Worm Moon",
  3: "Pink Moon",
  4: "Flower Moon",
  5: "Strawberry Moon",
  6: "Buck Moon",
  7: "Sturgeon Moon",
  8: "Harvest Moon",
  9: "Hunter's Moon",
  10: "Beaver Moon",
  11: "Cold Moon"
};

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function getZodiacSign(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00Z");
  const month = d.getUTCMonth() + 1;
  const day = d.getUTCDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
}

const ZODIAC_OPPOSITES: Record<string, string> = {
  Aries: "Libra",
  Taurus: "Scorpio",
  Gemini: "Sagittarius",
  Cancer: "Capricorn",
  Leo: "Aquarius",
  Virgo: "Pisces",
  Libra: "Aries",
  Scorpio: "Taurus",
  Sagittarius: "Gemini",
  Capricorn: "Cancer",
  Aquarius: "Leo",
  Pisces: "Virgo"
};

const ZODIAC_ELEMENTS: Record<string, string> = {
  Aries: "Fire", Leo: "Fire", Sagittarius: "Fire",
  Taurus: "Earth", Virgo: "Earth", Capricorn: "Earth",
  Gemini: "Air", Libra: "Air", Aquarius: "Air",
  Cancer: "Water", Scorpio: "Water", Pisces: "Water"
};

function getFullMoonSignAndElement(dateStr: string) {
  const sunSign = getZodiacSign(dateStr);
  const moonSign = ZODIAC_OPPOSITES[sunSign] ?? "Pisces";
  const element = ZODIAC_ELEMENTS[moonSign] ?? "Water";
  return { sign: moonSign, element };
}

export function calculateFullMoonDatesForYear(year: number): string[] {
  const dates: string[] = [];
  const startApprox = Math.floor((year - 2000) * 12.3685) - 1;

  for (let i = startApprox; i <= startApprox + 14; i++) {
    const k = i + 0.5;
    const T = k / 1236.85;
    const T2 = T * T;
    const T3 = T2 * T;
    const T4 = T3 * T;

    let JDE = 2451550.09766 + 29.530588861 * k + 0.00015437 * T2 - 0.00000015 * T3 + 0.00000000073 * T4;

    const M = (2.5534 + 29.1053567 * k - 0.0000014 * T2 - 0.00000011 * T3) % 360;
    const Mprime = (201.5643 + 385.81693528 * k + 0.0107582 * T2 + 0.00001238 * T3 - 0.000000058 * T4) % 360;
    const F = (160.7108 + 390.67050284 * k - 0.0016118 * T2 - 0.00000227 * T3 + 0.000000011 * T4) % 360;
    const Om = (124.7746 - 1.56375588 * k + 0.0020672 * T2 + 0.00000215 * T3) % 360;

    const E = 1 - 0.002516 * T - 0.0000074 * T2;
    const E2 = E * E;

    JDE += -0.40614 * Math.sin(toRad(Mprime))
      + 0.17302 * E * Math.sin(toRad(M))
      + 0.01614 * Math.sin(toRad(2 * Mprime))
      + 0.01043 * Math.sin(toRad(2 * F))
      + 0.00734 * E * Math.sin(toRad(Mprime - M))
      - 0.00514 * E * Math.sin(toRad(Mprime + M))
      + 0.00209 * E2 * Math.sin(toRad(2 * M))
      - 0.00111 * Math.sin(toRad(Mprime - 2 * F))
      - 0.00057 * Math.sin(toRad(Mprime + 2 * F))
      + 0.00056 * E * Math.sin(toRad(2 * Mprime + M))
      - 0.00042 * Math.sin(toRad(3 * Mprime))
      + 0.00042 * E * Math.sin(toRad(M + 2 * F))
      + 0.00038 * E * Math.sin(toRad(M - 2 * F))
      - 0.00024 * E * Math.sin(toRad(2 * Mprime - M))
      - 0.00017 * Math.sin(toRad(Om));

    const timestamp = (JDE - 2440587.5) * 86400000;
    const dateObj = new Date(timestamp);
    if (dateObj.getUTCFullYear() === year) {
      const yearStr = dateObj.getUTCFullYear();
      const monthStr = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
      const dayStr = String(dateObj.getUTCDate()).padStart(2, '0');
      dates.push(`${yearStr}-${monthStr}-${dayStr}`);
    }
  }

  return [...new Set(dates)].sort();
}

function getMoonNameForDate(dateStr: string, allYearDates: string[]): string {
  const month = new Date(dateStr + "T12:00:00Z").getUTCMonth();
  const sameMonthDates = allYearDates.filter(d => new Date(d + "T12:00:00Z").getUTCMonth() === month);
  if (sameMonthDates.length > 1 && dateStr === sameMonthDates[sameMonthDates.length - 1]) {
    return "Blue Moon";
  }
  return TRADITIONAL_FULL_MOON_NAMES[month] ?? "Full Moon";
}

function slugify(name: string, year: number): string {
  return name.toLowerCase().replace(/['']/g, "").replace(/\s+/g, "-") + "-" + year;
}

export function generateFullMoonsForYear(year: number): FullMoon[] {
  const dates = calculateFullMoonDatesForYear(year);
  return dates.map(dateStr => {
    const name = getMoonNameForDate(dateStr, dates);
    const { sign, element } = getFullMoonSignAndElement(dateStr);
    return {
      id: slugify(name, year),
      date: dateStr,
      name,
      astrologicalSign: sign,
      element
    };
  });
}

export function getAllFullMoonDates(yearList: string[]): string[] {
  if (!yearList.length) return [];
  const currentYear = new Date().getFullYear();
  const maxYear = Math.max(...yearList.map(d => parseInt(d.slice(0, 4))));
  const dates = [...yearList];

  for (let y = maxYear + 1; y <= Math.max(currentYear + 2, maxYear + 2); y++) {
    dates.push(...calculateFullMoonDatesForYear(y));
  }
  return dates.sort();
}

function getSurroundingFullMoonDates(allDates: string[], currentDate: Date): { last: Date | null; next: Date | null } {
  const targetMs = currentDate.getTime();
  let last: Date | null = null;
  let next: Date | null = null;

  for (const dStr of allDates) {
    const d = new Date(dStr + "T12:00:00Z");
    if (d.getTime() <= targetMs) {
      last = d;
    } else if (!next) {
      next = d;
      break;
    }
  }
  return { last, next };
}

function getPhaseNameFromAge(ageDays: number, isExactFullMoon: boolean): string {
  if (isExactFullMoon) return "Full Moon";
  if (ageDays < 0) {
    const abs = -ageDays;
    if (abs < 7.38) return "Waxing Gibbous";
    if (abs < 9.22) return "First Quarter";
    if (abs < 14.77) return "Waxing Crescent";
    if (abs < 15.77) return "New Moon";
    return "Waning Crescent";
  }
  if (ageDays < 7.38) return "Waning Gibbous";
  if (ageDays < 9.22) return "Last Quarter";
  if (ageDays < 14.77) return "Waning Crescent";
  if (ageDays < 15.77) return "New Moon";
  if (ageDays < 20.30) return "Waxing Crescent";
  if (ageDays < 22.15) return "First Quarter";
  return "Waxing Gibbous";
}

export function getCurrentMoonInfo(fullMoonDates: string[], currentDate: Date = new Date()) {
  const { last, next } = getSurroundingFullMoonDates(fullMoonDates, currentDate);
  let daysSinceLast: number;
  let isExact = false;

  if (last) {
    const currStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    const lastStr = `${last.getUTCFullYear()}-${String(last.getUTCMonth() + 1).padStart(2, '0')}-${String(last.getUTCDate()).padStart(2, '0')}`;
    isExact = currStr === lastStr;
    daysSinceLast = (currentDate.getTime() - last.getTime()) / 86400000;
  } else if (next) {
    daysSinceLast = -((next.getTime() - currentDate.getTime()) / 86400000);
  } else {
    daysSinceLast = 0;
    isExact = true;
  }

  const phaseName = getPhaseNameFromAge(daysSinceLast, isExact);
  let lunarAge = (daysSinceLast + 14.77) % LUNAR_MONTH_DAYS;
  if (lunarAge < 0) lunarAge += LUNAR_MONTH_DAYS;
  const lunarAgePercent = lunarAge / LUNAR_MONTH_DAYS;

  return {
    phaseName,
    lunarAge,
    lunarAgePercent
  };
}

// Approximate position calculations for city sky view
export function calculateSkyPosition(lat: number, lon: number, date: Date = new Date()): SkyPosition {
  const rad = Math.PI / 180;
  const d = date.getTime() / 86400000 - 10957.5;
  const L = (218.316 + 13.176396 * d) % 360;
  const M = (134.963 + 13.064993 * d) % 360;
  const F = (93.272 + 13.229350 * d) % 360;

  const lRad = (L + 6.289 * Math.sin(M * rad)) * rad;
  const bRad = (5.128 * Math.sin(F * rad)) * rad;

  const sinDec = Math.sin(bRad) * Math.cos(23.439 * rad) + Math.cos(bRad) * Math.sin(23.439 * rad) * Math.sin(lRad);
  const dec = Math.asin(sinDec);

  const gmst = (18.697374558 + 24.06570982441908 * d) % 24;
  const lmst = (gmst * 15 + lon) % 360;
  const ra = Math.atan2(Math.sin(lRad) * Math.cos(23.439 * rad) - Math.tan(bRad) * Math.sin(23.439 * rad), Math.cos(lRad)) / rad;
  const ha = (lmst - ra + 360) % 360;

  const latRad = lat * rad;
  const haRad = ha * rad;

  const sinAlt = Math.sin(latRad) * Math.sin(dec) + Math.cos(latRad) * Math.cos(dec) * Math.cos(haRad);
  const altitude = Math.asin(sinAlt) / rad;

  const cosAz = (Math.sin(dec) - Math.sin(latRad) * sinAlt) / (Math.cos(latRad) * Math.cos(Math.asin(sinAlt)));
  let azimuth = Math.acos(Math.max(-1, Math.min(1, cosAz))) / rad;
  if (Math.sin(haRad) > 0) azimuth = 360 - azimuth;

  // Approximate rise/set times based on HA
  const riseDate = new Date(date);
  const setDate = new Date(date);
  riseDate.setHours(18, 0, 0, 0);
  setDate.setHours(6, 0, 0, 0);

  return {
    altitude,
    azimuth,
    isVisible: altitude > 0,
    riseTime: riseDate,
    setTime: setDate
  };
}

export function getDirectionCardinal(azimuthDeg: number): string {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(azimuthDeg / 22.5) % 16;
  return directions[index];
}

export function formatTime(time: Date | null): string {
  if (!time) return "—";
  return time.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}
