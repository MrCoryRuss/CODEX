/* =============================================================
   lib/marine.ts
   Fetch marine/water conditions from Open-Meteo Marine API,
   tide data (TBD: WorldTides), and compute moon phase locally.

   Decision D-006: Open-Meteo as primary source.
   Sea surface temperature: not available from Open-Meteo.
   Tides: not available from Open-Meteo. Will use WorldTides API
   (see docs/03-data-sources.md). Mock data for now.
   ============================================================= */

import type {
  LocationConfig,
  MarineConditions,
  MarineSnapshot,
  TideEvent,
  TideSchedule,
  TideForecastDay,
  MoonPhase,
} from "@/types/weather";

import { degreesToCompass } from "@/types/weather";
import { POSADA } from "./weather";

const MARINE_BASE_URL = "https://marine-api.open-meteo.com/v1/marine";

// ── Open-Meteo Marine raw response types ────────────────────

interface OmMarineCurrent {
  time: string;
  wave_height: number;         // meters
  wave_direction: number;      // degrees
  wave_period: number;         // seconds
}

interface OmMarineHourly {
  time: string[];
  swell_wave_height: number[];
  swell_wave_direction: number[];
  swell_wave_period: number[];
}

interface OmMarineResponse {
  current?: OmMarineCurrent;
  hourly?: OmMarineHourly;
}

// ── URL builder ─────────────────────────────────────────────

function marineUrl(loc: LocationConfig): string {
  const params = new URLSearchParams({
    latitude: String(loc.latitude),
    longitude: String(loc.longitude),
    timezone: loc.timezone,
    current: "wave_height,wave_direction,wave_period",
    hourly: "swell_wave_height,swell_wave_direction,swell_wave_period",
    forecast_hours: "1", // we only need the first hour for current swell
  });
  return `${MARINE_BASE_URL}?${params}`;
}

// ── Mapper ──────────────────────────────────────────────────

function mapMarineConditions(
  current: OmMarineCurrent,
  hourly?: OmMarineHourly
): MarineConditions {
  // Swell comes from hourly data. Grab the first value if available.
  const swellH = hourly?.swell_wave_height?.[0] ?? current.wave_height;
  const swellD = hourly?.swell_wave_direction?.[0] ?? current.wave_direction;
  const swellP = hourly?.swell_wave_period?.[0] ?? current.wave_period;

  return {
    seaTempC: null, // Open-Meteo marine API doesn't provide SST. See TODO below.
    waveHeightM: current.wave_height,
    waveDirectionDeg: current.wave_direction,
    waveDirectionLabel: degreesToCompass(current.wave_direction),
    wavePeriodS: current.wave_period,
    swellHeightM: swellH,
    swellDirectionLabel: degreesToCompass(swellD),
    swellPeriodS: swellP,
    fetchedAt: new Date().toISOString(),
  };
}

// TODO: Sea surface temperature
// Open-Meteo doesn't expose SST. Options for later:
//   1. NOAA OISST dataset (daily, global 0.25° grid, free)
//      https://www.ncei.noaa.gov/products/optimum-interpolation-sst
//   2. Copernicus Marine Service (free with registration)
//   3. A local in-water sensor (best accuracy for the bay)
// For now, seaTempC comes from mock data. When a source is
// wired up, update mapMarineConditions to populate it.

// ── Fetch helper ────────────────────────────────────────────

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 21600 } }); // cache 6 hours
  if (!res.ok) {
    throw new Error(`Open-Meteo Marine ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

// ── Public API: Marine conditions ───────────────────────────

/**
 * Fetch current wave and swell conditions.
 * seaTempC will be null until an SST source is integrated.
 */
export async function fetchMarineConditions(
  loc: LocationConfig = POSADA
): Promise<MarineConditions> {
  try {
    const raw = await fetchJson<OmMarineResponse>(marineUrl(loc));
    if (!raw.current) throw new Error("No current marine data");
    return mapMarineConditions(raw.current, raw.hourly);
  } catch (err) {
    console.error("[marine] fetchMarineConditions failed, using mock:", err);
    return MOCK_MARINE_CONDITIONS;
  }
}

// ── Tides ───────────────────────────────────────────────────
// Source: Open-Meteo Marine API — sea_level_height_msl (hourly)
// We fetch 7 days of hourly sea-level, then find local extremes (turning
// points) to produce high/low tide events. Free, no API key required.
// Cache: 6 hours (tides change slowly; hourly precision is sufficient).

const MARINE_SEA_LEVEL_URL = "https://marine-api.open-meteo.com/v1/marine";

interface OmSeaLevelResponse {
  hourly: {
    time: string[];
    sea_level_height_msl: (number | null)[];
  };
}

function seaLevelUrl(loc: LocationConfig): string {
  return (
    `${MARINE_SEA_LEVEL_URL}?latitude=${loc.latitude}&longitude=${loc.longitude}` +
    `&timezone=${encodeURIComponent(loc.timezone)}` +
    `&hourly=sea_level_height_msl&forecast_days=7`
  );
}

/** Convert metres to feet, rounded to 1 decimal. */
function mToFt(m: number): number {
  return Math.round(m * 32.8084) / 10;
}

/**
 * Extract tide high/low extremes from an array of hourly sea-level values.
 * A turning point is a local min/max with at least 2 cm amplitude vs neighbours.
 */
function extractExtremes(
  times: string[],
  heights: (number | null)[]
): TideEvent[] {
  const events: TideEvent[] = [];
  let lastType: "high" | "low" | null = null;

  for (let i = 1; i < times.length - 1; i++) {
    const h0 = heights[i - 1];
    const h1 = heights[i];
    const h2 = heights[i + 1];
    if (h0 === null || h1 === null || h2 === null) continue;

    const isHigh = h1 >= h0 && h1 >= h2 && h1 - Math.min(h0, h2) > 0.02;
    const isLow = h1 <= h0 && h1 <= h2 && Math.max(h0, h2) - h1 > 0.02;

    if (!isHigh && !isLow) continue;
    const type: "high" | "low" = isHigh ? "high" : "low";

    // Skip flat-top duplicates (same type back-to-back at same height)
    if (events.length > 0) {
      const prev = events[events.length - 1];
      if (prev.type === type && prev.heightM === Math.round(h1 * 100) / 100) continue;
    }

    // Also suppress if same type as last emitted (consecutive same-direction)
    if (type === lastType) continue;

    // Format time: strip leading zero, keep AM/PM
    const [datePart, timePart] = times[i].split("T");
    const [hh, mm] = timePart.split(":");
    const hour24 = parseInt(hh, 10);
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    const ampm = hour24 < 12 ? "AM" : "PM";
    const timeStr = `${hour12}:${mm} ${ampm}`;

    events.push({
      type,
      time: timeStr,
      timeIso: `${times[i]}:00`,
      heightM: Math.round(h1 * 100) / 100,
      heightFt: mToFt(h1),
    });
    lastType = type;
  }

  return events;
}

/**
 * Fetch tide schedule for today + multi-day forecast.
 * Uses Open-Meteo Marine sea_level_height_msl — free, no key required.
 */
export async function fetchTideSchedule(
  loc: LocationConfig = POSADA
): Promise<TideSchedule> {
  try {
    const raw = await fetchJson<OmSeaLevelResponse>(seaLevelUrl(loc));
    const { time: times, sea_level_height_msl: heights } = raw.hourly;

    // Build all extremes across the full 7-day window
    const allEvents = extractExtremes(times, heights);

    // Today's date string in the location timezone
    const todayStr = new Date()
      .toLocaleDateString("en-CA", { timeZone: loc.timezone }); // YYYY-MM-DD

    // Today's events
    const todayEvents = allEvents.filter(
      (e) => e.timeIso.startsWith(todayStr)
    );

    // Build multi-day forecast (next 6 days after today)
    const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const forecastDays: TideForecastDay[] = [];
    const seenDates = new Set<string>();

    for (const e of allEvents) {
      const d = e.timeIso.slice(0, 10);
      if (d === todayStr) continue;
      if (!seenDates.has(d)) {
        const dt = new Date(d + "T12:00:00");
        forecastDays.push({
          date: d,
          dayLabel: DAY_NAMES[dt.getDay()],
          events: [],
        });
        seenDates.add(d);
      }
      forecastDays.find((fd) => fd.date === d)!.events.push(e);
    }

    return {
      date: todayStr,
      fetchedAt: new Date().toISOString(),
      events: todayEvents,
      forecast: forecastDays.slice(0, 6),
      isLive: true,
    };
  } catch (err) {
    console.error("[marine] fetchTideSchedule failed, using mock:", err);
    return MOCK_TIDE_SCHEDULE;
  }
}

// ── Moon phase ──────────────────────────────────────────────
// Calculated locally. No API needed. Based on the synodic month
// (29.53059 days) relative to a known new moon reference.

const KNOWN_NEW_MOON = new Date("2024-01-11T11:57:00Z").getTime();
const SYNODIC_MONTH = 29.53059;

const MOON_PHASES: { maxAge: number; name: string; emoji: string }[] = [
  { maxAge: 1.85,  name: "New Moon",        emoji: "🌑" },
  { maxAge: 7.38,  name: "Waxing Crescent", emoji: "🌒" },
  { maxAge: 9.23,  name: "First Quarter",   emoji: "🌓" },
  { maxAge: 14.77, name: "Waxing Gibbous",  emoji: "🌔" },
  { maxAge: 16.61, name: "Full Moon",        emoji: "🌕" },
  { maxAge: 22.15, name: "Waning Gibbous",  emoji: "🌖" },
  { maxAge: 23.99, name: "Last Quarter",     emoji: "🌗" },
  { maxAge: 27.68, name: "Waning Crescent",  emoji: "🌘" },
  { maxAge: 29.54, name: "New Moon",        emoji: "🌑" },
];

/**
 * Compute moon phase for a given date. No API call needed.
 */
export function getMoonPhase(date: Date = new Date()): MoonPhase {
  const daysSinceRef = (date.getTime() - KNOWN_NEW_MOON) / 86_400_000;
  const age = ((daysSinceRef % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;

  const phase = MOON_PHASES.find((p) => age < p.maxAge) ?? MOON_PHASES[0];

  // Illumination approximation: 0% at new moon, 100% at full moon
  const illum = Math.round(
    (1 - Math.cos((age / SYNODIC_MONTH) * 2 * Math.PI)) / 2 * 100
  );

  return {
    name: phase.name,
    illuminationPct: illum,
    emoji: phase.emoji,
  };
}

// ── Combined snapshot (what the homepage marine card needs) ──

/**
 * Fetch everything the marine card needs in one call.
 * Runs marine conditions + tides in parallel, adds moon phase.
 */
export async function fetchMarineSnapshot(
  loc: LocationConfig = POSADA
): Promise<MarineSnapshot> {
  const [conditions, tides] = await Promise.all([
    fetchMarineConditions(loc),
    fetchTideSchedule(loc),
  ]);

  return {
    conditions,
    tides,
    moon: getMoonPhase(),
  };
}

/**
 * Homepage wrapper: returns the snapshot plus isLive flag.
 * Matches the HomepageWeather pattern in lib/weather.ts.
 */
export interface HomepageMarine {
  snapshot: MarineSnapshot;
  isLive: boolean;
}

export async function fetchHomepageMarine(
  loc: LocationConfig = POSADA
): Promise<HomepageMarine> {
  try {
    const [conditions, tides] = await Promise.all([
      fetchMarineConditions(loc),
      fetchTideSchedule(loc),
    ]);

    // isLive = true if the wave data came from the API (not mock).
    // Tides are always mock until WorldTides is wired up.
    const isLive = conditions.fetchedAt !== MOCK_MARINE_CONDITIONS.fetchedAt;

    return {
      snapshot: { conditions, tides, moon: getMoonPhase() },
      isLive,
    };
  } catch (err) {
    console.error("[marine] fetchHomepageMarine failed, using full mock:", err);
    return {
      snapshot: {
        conditions: MOCK_MARINE_CONDITIONS,
        tides: MOCK_TIDE_SCHEDULE,
        moon: getMoonPhase(),
      },
      isLive: false,
    };
  }
}

// ── Mock fallback data ──────────────────────────────────────
// Plausible March values for Bahía Concepción.

export const MOCK_MARINE_CONDITIONS: MarineConditions = {
  seaTempC: 24,   // mock value; real source TBD
  waveHeightM: 0.3,
  waveDirectionDeg: 180,
  waveDirectionLabel: "S",
  wavePeriodS: 10,
  swellHeightM: 0.4,
  swellDirectionLabel: "S",
  swellPeriodS: 12,
  fetchedAt: "2026-03-27T08:00:00-07:00",
};

export const MOCK_TIDE_SCHEDULE: TideSchedule = {
  date: new Date().toLocaleDateString("en-CA", { timeZone: "America/Mazatlan" }),
  fetchedAt: new Date().toISOString(),
  isLive: false,
  events: [
    { type: "low",  time: "10:00 AM", timeIso: "", heightM: -0.38, heightFt: -1.2 },
    { type: "high", time: "8:00 PM",  timeIso: "", heightM:  0.58, heightFt:  1.9 },
  ] satisfies TideEvent[],
};
