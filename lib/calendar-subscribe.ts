const COMMUNITY_ID = process.env.NEXT_PUBLIC_GCAL_COMMUNITY_ID ?? "8f95c9c3eee2efc4c604b8e0584d566df4906035875bfdce98437eeee94fd43b@group.calendar.google.com";
const SPORTS_ID = process.env.NEXT_PUBLIC_GCAL_SPORTS_ID ?? "d520abc625d1e762f239e0a06cb34b9c2a3be3ade3b59c5732da04e694c84666@group.calendar.google.com";
export type CalendarType = "community" | "sports";
function calendarId(type: CalendarType): string { return type === "community" ? COMMUNITY_ID : SPORTS_ID; }
export function getIcsUrl(type: CalendarType): string { return `https://calendar.google.com/calendar/ical/${encodeURIComponent(calendarId(type))}/public/basic.ics`; }
export function getGoogleSubscribeUrl(type: CalendarType): string { return `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(calendarId(type))}`; }
export function getOutlookSubscribeUrl(type: CalendarType): string { const name = encodeURIComponent(type === "community" ? "Posada Underground Community" : "Posada Underground Sports"); return `https://outlook.live.com/calendar/0/addfromweb?url=${encodeURIComponent(getIcsUrl(type))}&name=${name}`; }
export function getWebcalUrl(type: CalendarType): string { return `webcal://calendar.google.com/calendar/ical/${encodeURIComponent(calendarId(type))}/public/basic.ics`; }
export function getAddToCalendarUrl(event: { title: string; date: string; startTime: string; endTime?: string; location?: string; description?: string; }): string {
  const start = `${event.date.replace(/-/g, "")}T${event.startTime.replace(":", "")}00`;
  const end = event.endTime ? `${event.date.replace(/-/g, "")}T${event.endTime.replace(":", "")}00` : start;
  const params = new URLSearchParams({ action: "TEMPLATE", text: event.title, dates: `${start}/${end}` });
  if (event.location) params.set("location", event.location);
  if (event.description) params.set("details", event.description);
  return `https://calendar.google.com/calendar/event?${params}`;
}
