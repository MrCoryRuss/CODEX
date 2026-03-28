/* =============================================================
   Mock data for homepage cards.
   Every export mirrors the shape the real API fetch will return.
   When you wire up Open-Meteo / WorldTides / Google Calendar,
   replace these objects — the components stay the same.
   ============================================================= */

// ── Quick stats (top strip) ──────────────────────────────────

export interface QuickStat {
  label: string;
  value: string;
  unit?: string;
  icon: string;
}

export const MOCK_QUICK_STATS: QuickStat[] = [
  { label: "Air", value: "32", unit: "°C", icon: "🌡" },
  { label: "Wind", value: "12", unit: "kts NNW", icon: "💨" },
  { label: "Sea", value: "24", unit: "°C", icon: "🌊" },
  { label: "Tide", value: "High 3:42p", icon: "🔵" },
];

// ── Weather map ──────────────────────────────────────────────

export interface WeatherMapData {
  embedUrl: string | null; // null = show placeholder
  attribution: string;
  lastUpdated: string;
}

export const MOCK_WEATHER_MAP: WeatherMapData = {
  embedUrl: null,
  attribution: "Windy.com",
  lastUpdated: "2026-03-27T08:00:00-07:00",
};

// ── Forecast ─────────────────────────────────────────────────

export interface ForecastDay {
  day: string;       // "Thu", "Fri", etc.
  date: string;      // "Mar 27"
  high: number;
  low: number;
  icon: string;      // emoji for now, icon component later
  summary: string;
  windKts: number;
  windDir: string;
}

export const MOCK_FORECAST: ForecastDay[] = [
  { day: "Thu", date: "Mar 27", high: 34, low: 22, icon: "☀️",  summary: "Clear",          windKts: 12, windDir: "NNW" },
  { day: "Fri", date: "Mar 28", high: 33, low: 21, icon: "⛅",  summary: "Partly cloudy",  windKts: 8,  windDir: "N" },
  { day: "Sat", date: "Mar 29", high: 31, low: 20, icon: "☀️",  summary: "Sunny",          windKts: 6,  windDir: "NE" },
  { day: "Sun", date: "Mar 30", high: 30, low: 19, icon: "🌤",  summary: "Mostly clear",   windKts: 10, windDir: "N" },
  { day: "Mon", date: "Mar 31", high: 32, low: 21, icon: "💨",  summary: "Windy, clear",   windKts: 22, windDir: "NNW" },
];

// ── Marine conditions ────────────────────────────────────────

export interface TideEvent {
  type: "high" | "low";
  time: string;
  heightM: number;
}

export interface MarineData {
  seaTempC: number;
  swellM: number;
  swellDir: string;
  swellPeriodS: number;
  moonPhase: string;
  moonPct: number;
  tides: TideEvent[];
}

export const MOCK_MARINE: MarineData = {
  seaTempC: 24,
  swellM: 0.4,
  swellDir: "S",
  swellPeriodS: 12,
  moonPhase: "Waxing Crescent",
  moonPct: 32,
  tides: [
    { type: "low",  time: "9:18 AM",  heightM: 0.2 },
    { type: "high", time: "3:42 PM",  heightM: 1.1 },
    { type: "low",  time: "9:55 PM",  heightM: 0.3 },
  ],
};

// ── Sports today ─────────────────────────────────────────────

export interface SportItem {
  sport: string;
  time: string;
  location: string;
  icon: string;
  dotColor: "sea" | "sun" | "danger";
}

export const MOCK_SPORTS: SportItem[] = [
  { sport: "Pickleball",       time: "8:00 AM",  location: "Courts by the ramp",     icon: "🏓", dotColor: "sea" },
  { sport: "Beach yoga",       time: "9:00 AM",  location: "Playa Burro",             icon: "🧘", dotColor: "sun" },
  { sport: "Beach volleyball",  time: "4:00 PM",  location: "Main beach",              icon: "🏐", dotColor: "sea" },
  { sport: "Sunset walk",      time: "5:30 PM",  location: "Meet at the tienda",      icon: "🚶", dotColor: "sun" },
];

// ── Community events ─────────────────────────────────────────

export interface EventItem {
  title: string;
  time: string;
  location: string;
  category: "social" | "service" | "market" | "medical";
}

export const MOCK_EVENTS: EventItem[] = [
  { title: "Community potluck",       time: "5:00 PM",  location: "George's palapa",  category: "social" },
  { title: "Movie night",             time: "7:30 PM",  location: "The point",         category: "social" },
  { title: "Visiting nurse clinic",   time: "10:00 AM", location: "Community center",  category: "medical" },
  { title: "Swap meet",               time: "9:00 AM",  location: "Parking area",      category: "market" },
];

// ── Announcements ────────────────────────────────────────────

export interface Announcement {
  id: string;
  text: string;
  level: "info" | "warning" | "urgent";
  date: string;
}

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "a1",
    level: "warning",
    date: "Mar 27",
    text: "North wind advisory tonight. 20-30 kts expected after midnight. Secure loose items.",
  },
  {
    id: "a2",
    level: "info",
    date: "Mar 26",
    text: "Water truck delivery scheduled for Friday morning. Fill your tanks.",
  },
  {
    id: "a3",
    level: "info",
    date: "Mar 25",
    text: "Road crew patching potholes on the main road this week. Expect brief delays.",
  },
];

// ── Audio briefing ───────────────────────────────────────────

export interface AudioBriefing {
  date: string;
  dateFormatted: string;
  durationSec: number;
  audioUrl: string | null; // null = not yet generated
  summary: string;
}

export const MOCK_AUDIO: AudioBriefing = {
  date: "2026-03-27",
  dateFormatted: "Thursday, March 27",
  durationSec: 135,
  audioUrl: null,
  summary: "Mostly clear, light wind this morning building to 12 kts NNW by afternoon. Sea temp 24°C. High tide at 3:42. Potluck tonight at George's palapa. Wind advisory goes into effect after midnight.",
};
