import { getWeekSchedule, getCalendarSource } from "@/lib/calendar";
import EventsPageClient from "@/components/calendar/events-page-client";

export const revalidate = 900;

export default async function EventsPage() {
  const week = await getWeekSchedule();
  const source = getCalendarSource();
  return <EventsPageClient week={week} source={source} />;
}
