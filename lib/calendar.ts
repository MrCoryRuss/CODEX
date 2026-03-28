/* =============================================================
   lib/calendar.ts
   Adapter layer for community events and sports schedules.

   Data source priority:
     1. Google Calendar API (if env vars are set)
     2. Mock data from data/mock-events.ts (fallback)

   The public functions return UI-friendly shapes. When the data
   source changes, only getAllEvents() changes. Everything
   downstream stays the same.

   Decision D-004: Google Calendar for events input.
   Decision D-008: Public calendar + API key approach.
   ============================================================= */

import type {
  CalendarEvent,
  SportCardItem,
  EventCardItem,
  DaySchedule,
  WeekSchedule,
  CommunityCategory,
} from "@/types/calendar";

import {
  isSportCategory,
  isCommunityCategory,
  sportDotColor,
  formatTime12h,
  formatDateLabel,
} from "@/types/calendar";

import { getGCalConfig, fetchGoogleCalendarEvents } from "@/lib/google-calendar";
import { MOCK_EVENTS } from "@/data/mock-events";

// ── Data source ─────────────────────────────────────────────
// Tries Google Calendar first. Falls back to mock data if:
//   - env vars are missing (local dev, preview deploys)
//   - the API call fails (quota, network, auth error)
//
// The 10-day window covers today + 4 days of "upcoming" with
// margin. ISR revalidation in page.tsx handles freshness.

let _lastSource: "google-calendar" | "mock" = "mock";

async function getAllEvents(): Promise<CalendarEvent[]> {
  const config = getGCalConfig();

  if (!config) {
    _lastSource = "mock";
    return MOCK_EVENTS;
  }

  try {
    const today = todayIso();
    const endDate = addDays(today, 10);
    const events = await fetchGoogleCalendarEvents(config, today, endDate);
    _lastSource = "google-calendar";
    console.info(`[calendar] Fetched ${events.length} events from Google Calendar`);
    return events;
  } catch (err) {
    console.error("[calendar] Google Calendar fetch failed, using mock:", err);
    _lastSource = "mock";
    return MOCK_EVENTS;
  }
}

/** Check whether the last fetch came from Google Calendar or mock data. */
export function getCalendarSource(): "google-calendar" | "mock" {
  return _lastSource;
}

// ── Filters ─────────────────────────────────────────────────

function eventsForDate(events: CalendarEvent[], dateStr: string): CalendarEvent[] {
  return events
    .filter((e) => e.date === dateStr && !e.cancelled)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
}

function sportsForDate(events: CalendarEvent[], dateStr: string): CalendarEvent[] {
  return eventsForDate(events, dateStr).filter((e) => isSportCategory(e.category));
}

function communityForDate(events: CalendarEvent[], dateStr: string): CalendarEvent[] {
  return eventsForDate(events, dateStr).filter((e) => isCommunityCategory(e.category));
}

// ── Mappers to UI card shapes ───────────────────────────────

function toSportCardItem(e: CalendarEvent): SportCardItem {
  if (!isSportCategory(e.category)) {
    throw new Error(`toSportCardItem called with non-sport event: ${e.id}`);
  }
  return {
    sport: e.title,
    time: formatTime12h(e.startTime),
    location: e.location,
    icon: e.icon,
    dotColor: sportDotColor(e.category),
  };
}

function toEventCardItem(e: CalendarEvent): EventCardItem {
  const cat: CommunityCategory = isCommunityCategory(e.category)
    ? e.category
    : "community";
  return {
    title: e.title,
    time: formatTime12h(e.startTime),
    location: e.location,
    category: cat,
  };
}

function buildDaySchedule(events: CalendarEvent[], dateStr: string): DaySchedule {
  return {
    date: dateStr,
    dateLabel: formatDateLabel(dateStr),
    sports: sportsForDate(events, dateStr).map(toSportCardItem),
    events: communityForDate(events, dateStr).map(toEventCardItem),
  };
}

// ── Date helpers ────────────────────────────────────────────

function todayIso(): string {
  // When Google Calendar env vars are present, use the real date.
  // When running on mock data, use a fixed date so the UI always has content.
  if (getGCalConfig()) {
    return new Date().toISOString().slice(0, 10);
  }
  return "2026-03-27";
}

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function dateRange(startDate: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => addDays(startDate, i));
}

// ── Public API ──────────────────────────────────────────────

export async function getTodaysSports(): Promise<SportCardItem[]> {
  const all = await getAllEvents();
  return sportsForDate(all, todayIso()).map(toSportCardItem);
}

export async function getTodaysEvents(): Promise<EventCardItem[]> {
  const all = await getAllEvents();
  return communityForDate(all, todayIso()).map(toEventCardItem);
}

export async function getScheduleForDate(dateStr?: string): Promise<DaySchedule> {
  const date = dateStr ?? todayIso();
  const all = await getAllEvents();
  return buildDaySchedule(all, date);
}

export async function getWeekSchedule(startDate?: string): Promise<WeekSchedule> {
  const start = startDate ?? todayIso();
  const dates = dateRange(start, 7);
  const all = await getAllEvents();

  return {
    startDate: start,
    endDate: dates[dates.length - 1],
    days: dates.map((d) => buildDaySchedule(all, d)),
  };
}

export async function getUpcomingEvents(
  count = 5,
  fromDate?: string
): Promise<CalendarEvent[]> {
  const from = fromDate ?? todayIso();
  const all = await getAllEvents();
  return all
    .filter((e) => e.date >= from && !e.cancelled)
    .sort((a, b) => {
      const dateCmp = a.date.localeCompare(b.date);
      if (dateCmp !== 0) return dateCmp;
      return a.startTime.localeCompare(b.startTime);
    })
    .slice(0, count);
}

export async function getEventsByCategory(
  category: CalendarEvent["category"]
): Promise<CalendarEvent[]> {
  const all = await getAllEvents();
  return all
    .filter((e) => e.category === category && !e.cancelled)
    .sort((a, b) => {
      const dateCmp = a.date.localeCompare(b.date);
      if (dateCmp !== 0) return dateCmp;
      return a.startTime.localeCompare(b.startTime);
    });
}

// ── Homepage combined fetch ─────────────────────────────────

export interface UpcomingEventItem extends EventCardItem {
  dateLabel: string;
}

export interface HomepageCalendar {
  sports: SportCardItem[];
  events: EventCardItem[];
  upcoming: UpcomingEventItem[];
  dateLabel: string;
  source: "google-calendar" | "mock";
}

export async function fetchHomepageCalendar(): Promise<HomepageCalendar> {
  const date = todayIso();
  const all = await getAllEvents();

  const sports = sportsForDate(all, date).map(toSportCardItem);
  const events = communityForDate(all, date).map(toEventCardItem);

  const upcomingDates = dateRange(addDays(date, 1), 3);
  const upcoming: UpcomingEventItem[] = upcomingDates.flatMap((d) =>
    communityForDate(all, d).map((e) => ({
      ...toEventCardItem(e),
      dateLabel: formatDateLabel(d),
    }))
  );

  return {
    sports,
    events,
    upcoming,
    dateLabel: formatDateLabel(date),
    source: _lastSource,
  };
}
