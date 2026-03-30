'use client';

import Link from "next/link";
import { MOCK_EVENTS } from "@/components/home/mock-data";

const CATEGORY_COLORS: Record<string, string> = {
  social: "sun",
  service: "sea",
  market: "desert",
  medical: "danger",
};

const CATEGORY_LABELS: Record<string, string> = {
  social: "Social",
  service: "Service",
  market: "Market",
  medical: "Medical",
};

export default function EventsPage() {
  const events = MOCK_EVENTS;

  return (
    <div className="page-container">
      <div className="events-hero">
        <h1>Community Events</h1>
        <p className="hero-sub">What&apos;s happening in Posada Concepcion</p>
      </div>

      <div className="filter-row">
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <button key={key} className="filter-chip">
            <span className="filter-dot" style={{ background: `var(--color-${CATEGORY_COLORS[key]})` }} />
            {label}
          </button>
        ))}
      </div>

      <section className="section">
        <h2 className="section-title">Today</h2>
        <div className="events-list">
          {events.map((e, i) => {
            const color = CATEGORY_COLORS[e.category];
            return (
              <div key={i} className="event-card">
                <div className="event-left">
                  <span className="event-dot" style={{ background: `var(--color-${color})` }} />
                  <div className="event-info">
                    <span className="event-title">{e.title}</span>
                    <span className="event-location">{e.location}</span>
                  </div>
                </div>
                <div className="event-right">
                  <span className="event-time">{e.time}</span>
                  <span className="event-category">{CATEGORY_LABELS[e.category]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="cta-section">
        <h3>Have an event to share?</h3>
        <p>Submit community events, announcements, or updates for the Posada calendar.</p>
        <Link href="/submit-update" className="cta-button">Submit an Update</Link>
      </section>

      <style jsx>{`
        .events-hero { background: linear-gradient(135deg, var(--color-sun) 0%, #d4881a 100%); color: var(--color-white); padding: var(--sp-6) var(--sp-4); border-radius: var(--radius-lg); margin-bottom: var(--sp-5); }
        .events-hero h1 { font-size: 32px; font-weight: 700; margin: 0 0 var(--sp-1) 0; color: var(--color-white); }
        .hero-sub { font-size: 15px; opacity: 0.9; margin: 0; }
        .filter-row { display: flex; gap: var(--sp-2); margin-bottom: var(--sp-6); overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .filter-chip { display: flex; align-items: center; gap: var(--sp-2); padding: var(--sp-2) var(--sp-3); background: var(--color-white); border: 1px solid var(--color-sand); border-radius: 20px; font-size: 14px; font-weight: 500; color: var(--color-night); cursor: pointer; white-space: nowrap; font-family: var(--font-body); transition: all 0.15s ease; }
        .filter-chip:hover { border-color: var(--color-sea); box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
        .filter-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .section { margin-bottom: var(--sp-8); }
        .section-title { font-size: 22px; font-weight: 700; color: var(--color-night); margin-bottom: var(--sp-4); }
        .events-list { display: flex; flex-direction: column; gap: var(--sp-3); }
        .event-card { background: var(--color-white); border-radius: var(--radius-md); box-shadow: var(--shadow-card); padding: var(--sp-4); display: flex; justify-content: space-between; align-items: center; gap: var(--sp-3); }
        .event-left { display: flex; align-items: center; gap: var(--sp-3); min-width: 0; }
        .event-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .event-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .event-title { font-size: 16px; font-weight: 600; color: var(--color-night); }
        .event-location { font-size: 13px; color: var(--color-desert); }
        .event-right { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; flex-shrink: 0; }
        .event-time { font-family: var(--font-data); font-size: 15px; font-weight: 500; color: var(--color-sea); }
        .event-category { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; color: var(--color-desert); }
        .cta-section { background: var(--color-sand-light); border-radius: var(--radius-lg); padding: var(--sp-6); text-align: center; }
        .cta-section h3 { font-size: 20px; font-weight: 700; color: var(--color-night); margin: 0 0 var(--sp-2) 0; }
        .cta-section p { font-size: 14px; color: var(--color-desert); margin: 0 0 var(--sp-4) 0; line-height: 1.5; }
        .cta-button { display: inline-block; padding: var(--sp-3) var(--sp-5); background: var(--color-sea); color: var(--color-white); border-radius: var(--radius-md); text-decoration: none; font-weight: 600; font-size: 15px; transition: background 0.15s ease; }
        .cta-button:hover { background: #1560a0; }
        @media (min-width: 640px) { .events-hero { padding: var(--sp-8) var(--sp-6); } .events-hero h1 { font-size: 40px; } }
      `}</style>
    </div>
  );
}
