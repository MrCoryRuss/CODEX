/* =============================================================
   lib/google-calendar.ts
   Low-level Google Calendar API v3 client.

   Uses the public events endpoint with an API key. No OAuth,
   no service account, no client library. The calendars must be
   set to "Make available to public" in Google Calendar settings.

   Decision D-004: Google Calendar for community events input.
   Decision D-008: Public calendar + API key approach.

   Env vars (see docs/10-deployment.md):
     GOOGLE_CALENDAR_API_KEY    - API key from Google Cloud Console
     GCAL_SPORTS_ID             - Calendar ID for sports schedule
     GCAL_COMMUNITY_ID          - Calendar ID for community events
   ============================================================= */

import type { CalendarEvent, EventCategory } from "@/types/calendar";

// ── Config ──────────────────────────────────────────────────

export interface GCalConfig {
  apiKey: string;
  sportsCalendarId: string;
  communityCalendarId: string;
}

export function getGCalConfig(): GCalConfig | null {
  const apiKey = process.env.GOOGLE_CALENDAR_API_KEY;
  const sportsId = process.env.GCAL_SPORTS_ID;
  const communityId = process.env.GCAL_COMMUNITY_ID;

  if (!apiKey || !sportsId || !communityId) {
    return null;
  }

  return {
    apiKey,
    sportsCalendarId: sportsId,
    communityCalendarId: communityId,
  };
}

// ── Google Calendar API raw types ───────────────────────────
// Subset of what the API returns. We only use what we need.

interface GCalDateTime {
  dateTime?: string;  // "2026-03-27T08:00:00-07:00"
  date?: string;      // "2026-03-27" (all-day events)
  timeZone?: string;
}

interface GCalEvent {
  id: string;
  status: string;       // "confirmed" | "tentative" | "cancelled"
  summary?: string;
  description?: string;
  location?: string;
  start: GCalDateTime;
  end?: GCalDateTime;
}

interface GCalListResponse {
  items?: GCalEvent[];
  nextPageToken?: string;
}

// ── API fetch ───────────────────────────────────────────────

const GCAL_BASE = "https://www.googleapis.com/calendar/v3/calendars";

async function fetchCalendarEvents(
  calendarId: string,
  apiKey: string,
  timeMin: string,
  timeMax: string
): Promise<GCalEvent[]> {
  const params = new URLSearchParams({
    key: apiKey,
    timeMin,
    timeMax,
    singleEvents: "true",   // expand recurring events into instances
    orderBy: "startTime",
    maxResults: "100",
  });

  const url = `${GCAL_BASE}/${encodeURIComponent(calendarId)}/events?${params}`;
  const res = await fetch(url, { next: { revalidate: 900 } }); // cache 15 min

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Google Calendar API ${res.status} for ${calendarId}: ${body.slice(0, 200)}`
    );
  }

  const data: GCalListResponse = await res.json();
  return data.items ?? [];
}

// ── Category detection ──────────────────────────────────────
// Sport subcategory is inferred from the event title.
// Community subcategory is inferred from title keywords.
// These work with however people naturally name their events
// in Google Calendar. Not perfect, but good enough for a
// community of 200 people who name things consistently.

const SPORT_KEYWORDS: [RegExp, EventCategory][] = [
  [/pickleball/i, "pickleball"],
  [/volleyball/i, "volleyball"],
  [/yoga/i, "yoga"],
  [/walk|hiking|hike/i, "walking"],
  [/fish/i, "fishing"],
  [/swim/i, "swimming"],
];

const COMMUNITY_KEYWORDS: [RegExp, EventCategory][] = [
  [/clinic|nurse|doctor|medical|health/i, "medical"],
  [/cleanup|clean.?up|trash/i, "service"],
  [/water.?truck|delivery|propane|road.?work/i, "service"],
  [/swap|market|garage.?sale|rummage/i, "market"],
];

function detectSportCategory(title: string): EventCategory {
  for (const [regex, cat] of SPORT_KEYWORDS) {
    if (regex.test(title)) return cat;
  }
  return "other-sport";
}

function detectCommunityCategory(title: string): EventCategory {
  for (const [regex, cat] of COMMUNITY_KEYWORDS) {
    if (regex.test(title)) return cat;
  }
  return "social";
}

// ── Icon mapping ────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, string> = {
  pickleball: "🏓",
  volleyball: "🏐",
  yoga: "🧘",
  walking: "🚶",
  fishing: "🎣",
  swimming: "🏊",
  "other-sport": "⚽",
  social: "🍽",
  service: "🔧",
  market: "🔄",
  medical: "🏥",
  community: "📋",
};

function iconForCategory(cat: EventCategory): string {
  return CATEGORY_ICONS[cat] ?? "📅";
}

// ── Mapper: GCalEvent -> CalendarEvent ──────────────────────

function extractDate(dt: GCalDateTime): string {
  if (dt.date) return dt.date;
  if (dt.dateTime) return dt.dateTime.slice(0, 10);
  return new Date().toISOString().slice(0, 10);
}

function extractTime(dt: GCalDateTime): string {
  if (dt.dateTime) {
    // "2026-03-27T08:00:00-07:00" -> "08:00"
    const match = dt.dateTime.match(/T(\d{2}:\d{2})/);
    if (match) return match[1];
  }
  // All-day events default to midnight
  return "00:00";
}

function mapGCalEvent(
  raw: GCalEvent,
  calendarType: "sports" | "community"
): CalendarEvent | null {
  // Skip cancelled events
  if (raw.status === "cancelled") return null;

  const title = raw.summary?.trim() ?? "Untitled event";
  const category =
    calendarType === "sports"
      ? detectSportCategory(title)
      : detectCommunityCategory(title);

  return {
    id: `gcal-${raw.id}`,
    title,
    category,
    date: extractDate(raw.start),
    startTime: extractTime(raw.start),
    endTime: raw.end ? extractTime(raw.end) : undefined,
    location: raw.location?.trim() ?? "TBD",
    description: raw.description?.trim().slice(0, 200) ?? undefined,
    icon: iconForCategory(category),
    cancelled: false,
    source: "google-calendar",
  };
}

// ── Public API ──────────────────────────────────────────────

/**
 * Fetch events from both Google Calendars for a date range.
 * Returns CalendarEvent[] merged and sorted.
 *
 * Throws on network/API errors so the caller can fall back.
 */
export async function fetchGoogleCalendarEvents(
  config: GCalConfig,
  fromDate: string,
  toDate: string
): Promise<CalendarEvent[]> {
  // Build ISO timestamps for the API (midnight to midnight, local-ish)
  const timeMin = `${fromDate}T00:00:00-07:00`; // MST
  const timeMax = `${toDate}T23:59:59-07:00`;

  const [sportsRaw, communityRaw] = await Promise.all([
    fetchCalendarEvents(config.sportsCalendarId, config.apiKey, timeMin, timeMax),
    fetchCalendarEvents(config.communityCalendarId, config.apiKey, timeMin, timeMax),
  ]);

  const sports = sportsRaw.map((e) => mapGCalEvent(e, "sports")).filter(Boolean) as CalendarEvent[];
  const community = communityRaw.map((e) => mapGCalEvent(e, "community")).filter(Boolean) as CalendarEvent[];

  const all = [...sports, ...community];
  all.sort((a, b) => {
    const dateCmp = a.date.localeCompare(b.date);
    if (dateCmp !== 0) return dateCmp;
    return a.startTime.localeCompare(b.startTime);
  });

  return all;
}
