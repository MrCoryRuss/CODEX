/* =============================================================
   types/weather.ts
   Canonical types for weather, marine, and related data.

   Every public-facing function in lib/weather.ts and lib/marine.ts
   returns one of these types. Components import directly from here.
   ============================================================= */

// ── Location ────────────────────────────────────────────────

export interface LocationConfig {
  latitude: number;
  longitude: number;
  timezone: string;
  name: string;
}

// ── Current Conditions ──────────────────────────────────────

export interface CurrentConditions {
  tempC: number;
  feelsLikeC: number;
  humidity: number;
  pressureHpa: number;
  uvIndex: number;
  weatherCode: number;
  weatherLabel: string;
  isDay: boolean;
  windSpeedKts: number;
  windDirectionDeg: number;
  windDirectionLabel: string;
  windGustsKts: number;
  fetchedAt: string;
}

// ── Forecast ────────────────────────────────────────────────

export interface ForecastDay {
  date: string;
  dayLabel: string;
  dateLabel: string;
  highC: number;
  lowC: number;
  weatherCode: number;
  weatherLabel: string;
  weatherIcon: string;
  windMaxKts: number;
  windDominantDir: string;
  precipMm: number;
  uvMax: number;
  sunrise: string;
  sunset: string;
}

export interface DailyForecast {
  days: ForecastDay[];
  fetchedAt: string;
}

// ── Wind ────────────────────────────────────────────────────

export interface WindHourly {
  time: string;
  speedKts: number;
  gustKts: number;
  directionDeg: number;
  directionLabel: string;
}

export interface WindForecast {
  hours: WindHourly[];
  fetchedAt: string;
}

// ── Marine ──────────────────────────────────────────────────

export interface MarineConditions {
  seaTempC: number | null;
  waveHeightM: number;
  waveDirectionDeg: number;
  waveDirectionLabel: string;
  wavePeriodS: number;
  swellHeightM: number;
  swellDirectionLabel: string;
  swellPeriodS: number;
  fetchedAt: string;
}

export interface TideEvent {
  type: "high" | "low";
  time: string;
  timeIso: string;
  heightM: number;
}

export interface TideSchedule {
  date: string;
  fetchedAt: string;
  events: TideEvent[];
}

export interface MoonPhase {
  name: string;
  illuminationPct: number;
  emoji: string;
}

export interface MarineSnapshot {
  conditions: MarineConditions;
  tides: TideSchedule;
  moon: MoonPhase;
}

// ── Weather code resolver ───────────────────────────────────
// WMO Weather interpretation codes (WW) used by Open-Meteo.
// https://open-meteo.com/en/docs → "WMO Weather interpretation codes"

interface WeatherCodeResult {
  label: string;
  icon: string;
}

const WMO_CODES: Record<number, { day: WeatherCodeResult; night: WeatherCodeResult }> = {
  0:  { day: { label: "Clear sky",         icon: "☀️" },  night: { label: "Clear sky",         icon: "🌙" } },
  1:  { day: { label: "Mainly clear",      icon: "🌤" },  night: { label: "Mainly clear",      icon: "🌙" } },
  2:  { day: { label: "Partly cloudy",     icon: "⛅" },  night: { label: "Partly cloudy",     icon: "☁️" } },
  3:  { day: { label: "Overcast",          icon: "☁️" },  night: { label: "Overcast",          icon: "☁️" } },
  45: { day: { label: "Fog",              icon: "🌫" },  night: { label: "Fog",              icon: "🌫" } },
  48: { day: { label: "Depositing fog",    icon: "🌫" },  night: { label: "Depositing fog",    icon: "🌫" } },
  51: { day: { label: "Light drizzle",     icon: "🌦" },  night: { label: "Light drizzle",     icon: "🌧" } },
  53: { day: { label: "Moderate drizzle",  icon: "🌦" },  night: { label: "Moderate drizzle",  icon: "🌧" } },
  55: { day: { label: "Dense drizzle",     icon: "🌧" },  night: { label: "Dense drizzle",     icon: "🌧" } },
  61: { day: { label: "Slight rain",       icon: "🌦" },  night: { label: "Slight rain",       icon: "🌧" } },
  63: { day: { label: "Moderate rain",     icon: "🌧" },  night: { label: "Moderate rain",     icon: "🌧" } },
  65: { day: { label: "Heavy rain",        icon: "🌧" },  night: { label: "Heavy rain",        icon: "🌧" } },
  71: { day: { label: "Slight snow",       icon: "🌨" },  night: { label: "Slight snow",       icon: "🌨" } },
  73: { day: { label: "Moderate snow",     icon: "🌨" },  night: { label: "Moderate snow",     icon: "🌨" } },
  75: { day: { label: "Heavy snow",        icon: "❄️" },  night: { label: "Heavy snow",        icon: "❄️" } },
  80: { day: { label: "Slight showers",    icon: "🌦" },  night: { label: "Slight showers",    icon: "🌧" } },
  81: { day: { label: "Moderate showers",  icon: "🌧" },  night: { label: "Moderate showers",  icon: "🌧" } },
  82: { day: { label: "Violent showers",   icon: "⛈" },  night: { label: "Violent showers",   icon: "⛈" } },
  95: { day: { label: "Thunderstorm",      icon: "⛈" },  night: { label: "Thunderstorm",      icon: "⛈" } },
  96: { day: { label: "T-storm w/ hail",   icon: "⛈" },  night: { label: "T-storm w/ hail",   icon: "⛈" } },
  99: { day: { label: "T-storm w/ heavy hail", icon: "⛈" }, night: { label: "T-storm w/ heavy hail", icon: "⛈" } },
};

export function resolveWeatherCode(code: number, isDay: boolean): WeatherCodeResult {
  const entry = WMO_CODES[code];
  if (!entry) return { label: `Code ${code}`, icon: "❓" };
  return isDay ? entry.day : entry.night;
}

// ── Unit helpers ────────────────────────────────────────────

/** Convert km/h to knots, rounded to nearest integer. */
export function kmhToKnots(kmh: number): number {
  return Math.round(kmh * 0.539957);
}

/** Convert degrees (0-360) to 16-point compass label. */
export function degreesToCompass(deg: number): string {
  const directions = [
    "N", "NNE", "NE", "ENE",
    "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW",
    "W", "WNW", "NW", "NNW",
  ];
  const index = Math.round(((deg % 360) + 360) % 360 / 22.5) % 16;
  return directions[index];
}
