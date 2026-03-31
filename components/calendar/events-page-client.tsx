'use client';
import Link from "next/link";
import { SubscribeButtons } from "@/components/calendar";
import { getAddToCalendarUrl } from "@/lib/calendar-subscribe";
import type { EventCardItem, WeekSchedule } from "@/types/calendar";
const CATEGORY_COLORS: Record<string, string> = { social: "sun", service: "sea", market: "desert", medical: "danger", community: "sea" };
const CATEGORY_LABELS: Record<string, string> = { social: "Social", service: "Service", market: "Market", medical: "Medical", community: "Community" };
function EventCard({ event, date }: { event: EventCardItem; date: string }) {
  const color = CATEGORY_COLORS[event.category] ?? "sea";
  const addUrl = getAddToCalendarUrl({ title: event.title, date, startTime: event.time, location: event.location });
  return (
    <div className="event-card">
      <div className="event-left"><span className="event-dot" style={{ background: `var(--color-${color})` }} /><div className="event-info"><span className="event-title">{event.title}</span><span className="event-meta">{event.location} &middot; {event.time}</span></div></div>
      <div className="event-right"><span className="event-category">{CATEGORY_LABELS[event.category] ?? event.category}</span><a href={addUrl} target="_blank" rel="noopener noreferrer" className="add-cal-link">+ Add</a></div>
      <style jsx>{`
        .event-card { background: var(--color-surface); border-radius: var(--radius-md); border: 1px solid var(--color-border-light); padding: var(--sp-4); display: flex; justify-content: space-between; align-items: center; gap: var(--sp-3); transition: box-shadow 0.15s ease; }
        .event-card:hover { box-shadow: var(--shadow-card); }
        .event-left { display: flex; align-items: center; gap: var(--sp-3); min-width: 0; }
        .event-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .event-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .event-title { font-size: 15px; font-weight: 600; color: var(--color-text); }
        .event-meta { font-size: 13px; color: var(--color-text-muted); }
        .event-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; }
        .event-category { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--color-text-muted); }
        .add-cal-link { font-size: 12px; font-weight: 600; color: var(--color-primary); text-decoration: none; padding: 2px 8px; border-radius: 6px; transition: background 0.15s ease; }
        .add-cal-link:hover { background: var(--color-primary-soft); text-decoration: none; }
      `}</style>
    </div>
  );
}
interface Props { week: WeekSchedule; source: "google-calendar" | "mock"; }
export default function EventsPageClient({ week, source }: Props) {
  return (
    <div className="page-container">
      <div className="events-hero"><div className="hero-top"><div><h1>Community Calendar</h1><p className="hero-sub">Events, sports &amp; activities in Posada Concepcion</p></div><span className={`source-badge source-badge--${source === "google-calendar" ? "live" : "mock"}`}>{source === "google-calendar" ? "Live" : "Demo data"}</span></div></div>
      <div className="subscribe-section"><p className="subscribe-intro">Subscribe to sync events to your phone &amp; email calendar automatically:</p><div className="subscribe-row"><SubscribeButtons calendarType="community" label="Community Events" /><SubscribeButtons calendarType="sports" label="Sports Schedule" /></div></div>
      {week.days.map((day) => { if (day.events.length === 0 && day.sports.length === 0) return null; return (<section key={day.date} className="day-section"><h3 className="day-heading">{day.dateLabel}</h3><div className="events-list">{day.events.map((e, i) => (<EventCard key={`e-${i}`} event={e} date={day.date} />))}{day.sports.map((s, i) => (<EventCard key={`s-${i}`} event={{ title: s.sport, time: s.time, location: s.location, category: "community" }} date={day.date} />))}</div></section>); })}
      {week.days.every(d => d.events.length === 0 && d.sports.length === 0) && (<div className="empty-state"><p>No events scheduled this week. Check back soon or subscribe to get notified!</p></div>)}
      <section className="cta-section"><h3>Have an event to share?</h3><p>Submit community events, announcements, or updates for the Posada calendar.</p><Link href="/submit-update" className="cta-button">Submit an Update</Link></section>
      <style jsx>{`
        .events-hero { background: var(--color-surface); border-radius: 20px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); border: 1px solid #f0f1f4; }
        .hero-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .events-hero h1 { font-size: 28px; font-weight: 800; margin: 0 0 4px 0; }
        .hero-sub { font-size: 15px; color: #64748b; margin: 0; }
        .source-badge { font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 20px; white-space: nowrap; }
        .source-badge--live { background: #ecfdf5; color: #059669; border: 1px solid #d1fae5; }
        .source-badge--mock { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
        .subscribe-section { margin-bottom: 32px; }
        .subscribe-intro { font-size: 14px; color: #64748b; margin-bottom: 12px; }
        .subscribe-row { display: flex; gap: 12px; flex-wrap: wrap; }
        .day-section { margin-bottom: 32px; }
        .day-heading { font-size: 16px; font-weight: 700; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #f0f1f4; }
        .events-list { display: flex; flex-direction: column; gap: 8px; }
        .empty-state { text-align: center; padding: 48px; color: #94a3b8; background: #f1f3f7; border-radius: 16px; margin-bottom: 32px; }
        .cta-section { background: #f1f3f7; border-radius: 16px; padding: 32px; text-align: center; border: 1px solid #f0f1f4; }
        .cta-section h3 { font-size: 20px; font-weight: 700; margin: 0 0 8px 0; }
        .cta-section p { font-size: 14px; color: #64748b; margin: 0 0 16px 0; }
        .cta-button { display: inline-block; padding: 12px 24px; background: #0066ff; color: white; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 15px; }
        .cta-button:hover { background: #0052cc; text-decoration: none; }
        @media (min-width: 640px) { .events-hero { padding: 32px; } .events-hero h1 { font-size: 32px; } }
      `}</style>
    </div>
  );
}
