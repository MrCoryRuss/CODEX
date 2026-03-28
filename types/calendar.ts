/* =============================================================
   types/calendar.ts
   Canonical types for events, sports, and community calendar data.

   Used by lib/calendar.ts, lib/google-calendar.ts, data/mock-events.ts,
   and all calendar-related components.
   ============================================================= */

// ── Event categories ────────────────────────────────────────

export type SportCategory =
  | "pickleball"
  | "volleyball"
  | "yoga"
  | "walking"
  | "fishing"
  | "swimming"
  | "other-sport";

export type CommunityCategory =
  | "social"
  | "service"
  | "market"
  | "medical"
  | "community";

export type EventCategory = SportCategory | CommunityCategory;

// ── Category guards ─────────────────────────────────────────

const SPORT_CATEGORIES: Set<string> = new Set([
  "pickleball", "volleyball", "yoga", "walking",
  "fishing", "swimming", "other-sport",
]);

const COMMUNITY_CATEGORIES: Set<string> = new Set([
  "social", "service", "market", "medical", "community",
]);

export function isSportCategory(cat: string): cat is SportCategory {
  return SPORT_CATEGORIES.has(cat);
}

export function isCommunityCategory(cat: string): cat is CommunityCategory {
  return COMMUNITY_CATEGORIES.has(cat);
}

// ── Core event type ─────────────────────────────────────────

export interface CalendarEvent {
  id: string;
  title: string;
  category: EventCategory;
  date: string;           // "2026-03-27"
  startTime: string;      // "08:00" (24h)
  endTime?: string;       // "10:00" (24h)
  location: string;
  description?: string;
  contact?: string;
  icon: string;           // emoji
  cancelled?: boolean;
  recurrence?: {
    pattern: "daily" | "weekly" | "monthly";
    days?: string[];
  };
  source?: "google-calendar" | "mock";
}

// ── UI card shapes ──────────────────────────────────────────

export interface SportCardItem {
  sport: string;
  time: string;          // "8:00 AM"
  location: string;
  icon: string;
  dotColor: "sea" | "sun" | "danger";
}

export interface EventCardItem {
  title: string;
  time: string;          // "5:00 PM"
  location: string;
  category: CommunityCategory;
}

export interface DaySchedule {
  date: string;
  dateLabel: string;
  sports: SportCardItem[];
  events: EventCardItem[];
}

export interface WeekSchedule {
  startDate: string;
  endDate: string;
  days: DaySchedule[];
}

// ── Helpers ─────────────────────────────────────────────────

/** Sport dot color for the SportsCard component. */
export function sportDotColor(cat: SportCategory): "sea" | "sun" | "danger" {
  switch (cat) {
    case "pickleball":
    case "volleyball":
    case "swimming":
      return "sea";
    case "yoga":
    case "walking":
    case "fishing":
      return "sun";
    default:
      return "sea";
  }
}

/** "08:00" -> "8:00 AM" */
export function formatTime12h(time24: string): string {
  const [hStr, mStr] = time24.split(":");
  const h = parseInt(hStr, 10);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${mStr} ${suffix}`;
}

/** "2026-03-27" -> "Mar 27" */
export function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
