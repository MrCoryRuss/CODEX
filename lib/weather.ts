/* =============================================================
   lib/weather.ts
   Fetch weather data from Open-Meteo and map it to app types.

   Decision D-006: Open-Meteo is primary, no API key required.
   Coordinates from docs/03-data-sources.md: 26.6°N, 111.8°W.

   Every public function returns canonical types from types/weather.ts.
   On fetch failure, each function returns mock data so the UI
   always has something to render.
   ============================================================= */

import type {
  LocationConfig,
  CurrentConditions,
  DailyForecast,
  ForecastDay,
  WindForecast,
  WindHourly,
} from "@/types/weather";

import {
  resolveWeatherCode,
  degreesToCompass,
  kmhToKnots,
} from "@/types/weather";

// ── Config ──────────────────────────────────────────────────

export const POSADA: LocationConfig = {
  latitude: 26.6,
  longitude: -111.8,
  timezone: "America/Mazatlan", // BCS observes MST year-round
  name: "Posada Concepcion",
};

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

// ── Open-Meteo raw response types ───────────────────────────
// These match what the API actually returns. We keep them
// private to this module. The rest of the app never sees them.

interface OmCurrentUnits {
  temperature_2m: string;
  [key: string]: string;
}

interface OmCurrent {
  time: string;
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  surface_pressure: number;
  weather_code: number;
  is_day: number;              // 0 or 1
  wind_speed_10m: number;      // km/h
  wind_direction_10m: number;  // degrees
  wind_gusts_10m: number;      // km/h
  uv_index: number;
}

interface OmDaily {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weather_code: number[];
  wind_speed_10m_max: number[];
  wind_direction_10m_dominant: number[];
  precipitation_sum: number[];
  uv_index_max: number[];
  sunrise: string[];
  sunset: string[];
}

interface OmHourly {
  time: string[];
  wind_speed_10m: number[];
  wind_gusts_10m: number[];
  wind_direction_10m: number[];
}

interface OmForecastResponse {
  current?: OmCurrent;
  current_units?: OmCurrentUnits;
  daily?: OmDaily;
  hourly?: OmHourly;
}

// ── URL builders ────────────────────────────────────────────

function currentUrl(loc: LocationConfig): string {
  const params = new URLSearchParams({
    latitude: String(loc.latitude),
    longitude: String(loc.longitude),
    timezone: loc.timezone,
    current: [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "surface_pressure",
      "weather_code",
      "is_day",
      "wind_speed_10m",
      "wind_direction_10m",
      "wind_gusts_10m",
      "uv_index",
    ].join(","),
  });
  return `${BASE_URL}?${params}`;
}

function dailyUrl(loc: LocationConfig, days = 7): string {
  const params = new URLSearchParams({
    latitude: String(loc.latitude),
    longitude: String(loc.longitude),
    timezone: loc.timezone,
    forecast_days: String(days),
    daily: [
      "temperature_2m_max",
      "temperature_2m_min",
      "weather_code",
      "wind_speed_10m_max",
      "wind_direction_10m_dominant",
      "precipitation_sum",
      "uv_index_max",
      "sunrise",
      "sunset",
    ].join(","),
  });
  return `${BASE_URL}?${params}`;
}

function hourlyWindUrl(loc: LocationConfig, hours = 48): string {
  const params = new URLSearchParams({
    latitude: String(loc.latitude),
    longitude: String(loc.longitude),
    timezone: loc.timezone,
    forecast_hours: String(hours),
    hourly: [
      "wind_speed_10m",
      "wind_gusts_10m",
      "wind_direction_10m",
    ].join(","),
  });
  return `${BASE_URL}?${params}`;
}

// ── Mappers ─────────────────────────────────────────────────

function mapCurrent(raw: OmCurrent): CurrentConditions {
  const isDay = raw.is_day === 1;
  const { label, icon } = resolveWeatherCode(raw.weather_code, isDay);
  void icon; // icon used by forecast mapper, not current

  return {
    tempC: Math.round(raw.temperature_2m),
    feelsLikeC: Math.round(raw.apparent_temperature),
    humidity: Math.round(raw.relative_humidity_2m),
    pressureHpa: Math.round(raw.surface_pressure),
    uvIndex: raw.uv_index,
    weatherCode: raw.weather_code,
    weatherLabel: label,
    isDay,
    windSpeedKts: kmhToKnots(raw.wind_speed_10m),
    windDirectionDeg: raw.wind_direction_10m,
    windDirectionLabel: degreesToCompass(raw.wind_direction_10m),
    windGustsKts: kmhToKnots(raw.wind_gusts_10m),
    fetchedAt: new Date().toISOString(),
  };
}

function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatTimeShort(isoStr: string): string {
  const d = new Date(isoStr);
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h % 12 || 12}:${m}`;
}

function mapDailyForecast(raw: OmDaily): DailyForecast {
  const days: ForecastDay[] = raw.time.map((dateStr, i) => {
    const code = raw.weather_code[i];
    const resolved = resolveWeatherCode(code, true);
    return {
      date: dateStr,
      dayLabel: formatDayLabel(dateStr),
      dateLabel: formatDateLabel(dateStr),
      highC: Math.round(raw.temperature_2m_max[i]),
      lowC: Math.round(raw.temperature_2m_min[i]),
      weatherCode: code,
      weatherLabel: resolved.label,
      weatherIcon: resolved.icon,
      windMaxKts: kmhToKnots(raw.wind_speed_10m_max[i]),
      windDominantDir: degreesToCompass(raw.wind_direction_10m_dominant[i]),
      precipMm: raw.precipitation_sum[i],
      uvMax: raw.uv_index_max[i],
      sunrise: formatTimeShort(raw.sunrise[i]),
      sunset: formatTimeShort(raw.sunset[i]),
    };
  });

  return { days, fetchedAt: new Date().toISOString() };
}

function mapHourlyWind(raw: OmHourly): WindForecast {
  const hours: WindHourly[] = raw.time.map((t, i) => ({
    time: t,
    speedKts: kmhToKnots(raw.wind_speed_10m[i]),
    gustKts: kmhToKnots(raw.wind_gusts_10m[i]),
    directionDeg: raw.wind_direction_10m[i],
    directionLabel: degreesToCompass(raw.wind_direction_10m[i]),
  }));
  return { hours, fetchedAt: new Date().toISOString() };
}

// ── Combined URL (current + daily in one call) ──────────────

function homepageUrl(loc: LocationConfig, days = 7): string {
  const params = new URLSearchParams({
    latitude: String(loc.latitude),
    longitude: String(loc.longitude),
    timezone: loc.timezone,
    forecast_days: String(days),
    current: [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "surface_pressure",
      "weather_code",
      "is_day",
      "wind_speed_10m",
      "wind_direction_10m",
      "wind_gusts_10m",
      "uv_index",
    ].join(","),
    daily: [
      "temperature_2m_max",
      "temperature_2m_min",
      "weather_code",
      "wind_speed_10m_max",
      "wind_direction_10m_dominant",
      "precipitation_sum",
      "uv_index_max",
      "sunrise",
      "sunset",
    ].join(","),
  });
  return `${BASE_URL}?${params}`;
}

// ── Fetch helpers ───────────────────────────────────────────

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 1800 } }); // cache 30 min
  if (!res.ok) {
    throw new Error(`Open-Meteo ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

// ── Public API ──────────────────────────────────────────────

/**
 * Fetch current weather conditions for Posada Concepcion.
 * Falls back to mock data on failure.
 */
export async function fetchCurrentConditions(
  loc: LocationConfig = POSADA
): Promise<CurrentConditions> {
  try {
    const raw = await fetchJson<OmForecastResponse>(currentUrl(loc));
    if (!raw.current) throw new Error("No current data in response");
    return mapCurrent(raw.current);
  } catch (err) {
    console.error("[weather] fetchCurrentConditions failed, using mock:", err);
    return MOCK_CURRENT;
  }
}

/**
 * Fetch 7-day daily forecast for Posada Concepcion.
 * Falls back to mock data on failure.
 */
export async function fetchDailyForecast(
  loc: LocationConfig = POSADA,
  days = 7
): Promise<DailyForecast> {
  try {
    const raw = await fetchJson<OmForecastResponse>(dailyUrl(loc, days));
    if (!raw.daily) throw new Error("No daily data in response");
    return mapDailyForecast(raw.daily);
  } catch (err) {
    console.error("[weather] fetchDailyForecast failed, using mock:", err);
    return MOCK_DAILY_FORECAST;
  }
}

/**
 * Fetch 48-hour hourly wind forecast for Posada Concepcion.
 * Falls back to mock data on failure.
 */
export async function fetchWindForecast(
  loc: LocationConfig = POSADA,
  hours = 48
): Promise<WindForecast> {
  try {
    const raw = await fetchJson<OmForecastResponse>(hourlyWindUrl(loc, hours));
    if (!raw.hourly) throw new Error("No hourly data in response");
    return mapHourlyWind(raw.hourly);
  } catch (err) {
    console.error("[weather] fetchWindForecast failed, using mock:", err);
    return MOCK_WIND_FORECAST;
  }
}

/**
 * Combined fetch for the homepage: current conditions + daily forecast
 * in a single Open-Meteo call. More efficient than two separate requests.
 * Returns an isLive flag so the UI can indicate live vs fallback data.
 */
export interface HomepageWeather {
  current: CurrentConditions;
  forecast: DailyForecast;
  isLive: boolean;
}

export async function fetchHomepageWeather(
  loc: LocationConfig = POSADA,
  days = 7
): Promise<HomepageWeather> {
  try {
    const raw = await fetchJson<OmForecastResponse>(homepageUrl(loc, days));
    if (!raw.current || !raw.daily) {
      throw new Error("Incomplete response: missing current or daily data");
    }
    return {
      current: mapCurrent(raw.current),
      forecast: mapDailyForecast(raw.daily),
      isLive: true,
    };
  } catch (err) {
    console.error("[weather] fetchHomepageWeather failed, using mock:", err);
    return {
      current: MOCK_CURRENT,
      forecast: MOCK_DAILY_FORECAST,
      isLive: false,
    };
  }
}

// ── Mock fallback data ──────────────────────────────────────
// Used when API calls fail or during local development.
// Values are plausible March conditions for Posada Concepcion.

export const MOCK_CURRENT: CurrentConditions = {
  tempC: 32,
  feelsLikeC: 34,
  humidity: 38,
  pressureHpa: 1014,
  uvIndex: 8,
  weatherCode: 0,
  weatherLabel: "Clear sky",
  isDay: true,
  windSpeedKts: 12,
  windDirectionDeg: 338,
  windDirectionLabel: "NNW",
  windGustsKts: 18,
  fetchedAt: "2026-03-27T10:00:00-07:00",
};

export const MOCK_DAILY_FORECAST: DailyForecast = {
  fetchedAt: "2026-03-27T08:00:00-07:00",
  days: [
    { date: "2026-03-27", dayLabel: "Thu", dateLabel: "Mar 27", highC: 34, lowC: 22, weatherCode: 0,  weatherLabel: "Clear sky",       weatherIcon: "☀️",  windMaxKts: 12, windDominantDir: "NNW", precipMm: 0,   uvMax: 8,  sunrise: "6:32",  sunset: "6:45" },
    { date: "2026-03-28", dayLabel: "Fri", dateLabel: "Mar 28", highC: 33, lowC: 21, weatherCode: 2,  weatherLabel: "Partly cloudy",   weatherIcon: "⛅",  windMaxKts: 8,  windDominantDir: "N",   precipMm: 0,   uvMax: 7,  sunrise: "6:31",  sunset: "6:46" },
    { date: "2026-03-29", dayLabel: "Sat", dateLabel: "Mar 29", highC: 31, lowC: 20, weatherCode: 0,  weatherLabel: "Clear sky",       weatherIcon: "☀️",  windMaxKts: 6,  windDominantDir: "NE",  precipMm: 0,   uvMax: 9,  sunrise: "6:30",  sunset: "6:46" },
    { date: "2026-03-30", dayLabel: "Sun", dateLabel: "Mar 30", highC: 30, lowC: 19, weatherCode: 1,  weatherLabel: "Mainly clear",    weatherIcon: "🌤",  windMaxKts: 10, windDominantDir: "N",   precipMm: 0,   uvMax: 8,  sunrise: "6:29",  sunset: "6:47" },
    { date: "2026-03-31", dayLabel: "Mon", dateLabel: "Mar 31", highC: 32, lowC: 21, weatherCode: 0,  weatherLabel: "Clear sky",       weatherIcon: "☀️",  windMaxKts: 22, windDominantDir: "NNW", precipMm: 0,   uvMax: 8,  sunrise: "6:28",  sunset: "6:47" },
    { date: "2026-04-01", dayLabel: "Tue", dateLabel: "Apr 1",  highC: 33, lowC: 22, weatherCode: 1,  weatherLabel: "Mainly clear",    weatherIcon: "🌤",  windMaxKts: 14, windDominantDir: "N",   precipMm: 0,   uvMax: 9,  sunrise: "6:27",  sunset: "6:48" },
    { date: "2026-04-02", dayLabel: "Wed", dateLabel: "Apr 2",  highC: 34, lowC: 23, weatherCode: 0,  weatherLabel: "Clear sky",       weatherIcon: "☀️",  windMaxKts: 8,  windDominantDir: "NE",  precipMm: 0,   uvMax: 9,  sunrise: "6:26",  sunset: "6:48" },
  ],
};

export const MOCK_WIND_FORECAST: WindForecast = {
  fetchedAt: "2026-03-27T08:00:00-07:00",
  hours: Array.from({ length: 48 }, (_, i) => {
    const d = new Date("2026-03-27T00:00:00-07:00");
    d.setHours(d.getHours() + i);
    // Simulate typical Posada pattern: calm morning, wind builds afternoon, drops at night
    const hour = d.getHours();
    const base = hour >= 11 && hour <= 18 ? 14 : hour >= 6 && hour <= 10 ? 6 : 4;
    const variation = Math.round(Math.sin(i * 0.3) * 3);
    const speed = Math.max(2, base + variation);
    return {
      time: d.toISOString(),
      speedKts: speed,
      gustKts: Math.round(speed * 1.4),
      directionDeg: 338 + Math.round(Math.sin(i * 0.2) * 15),
      directionLabel: "NNW",
    };
  }),
};
