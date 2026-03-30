'use client';

import Link from "next/link";
import { MOCK_SPORTS } from "@/components/home/mock-data";

export default function SportsPage() {
  const activities = MOCK_SPORTS;

  const morning = activities.filter(s => {
    const hour = parseInt(s.time);
    return hour < 12 || s.time.includes("AM");
  });
  const afternoon = activities.filter(s => {
    const hour = parseInt(s.time);
    return (hour >= 12 || s.time.includes("PM")) && !morning.includes(s);
  });

  const renderActivity = (s: typeof activities[0], i: number) => (
    <div key={i} className="activity-card">
      <span className="activity-icon" aria-hidden="true">{s.icon}</span>
      <div className="activity-info">
        <span className="activity-name">{s.sport}</span>
        <span className="activity-location">{s.location}</span>
      </div>
      <span className="activity-time">{s.time}</span>
    </div>
  );

  return (
    <div className="page-container">
      <div className="sports-hero">
        <h1>Sports &amp; Activities</h1>
        <p className="hero-sub">Stay active in Posada Concepcion</p>
      </div>

      {morning.length > 0 && (
        <section className="section">
          <h2 className="section-title">Morning</h2>
          <div className="activities-list">{morning.map(renderActivity)}</div>
        </section>
      )}

      {afternoon.length > 0 && (
        <section className="section">
          <h2 className="section-title">Afternoon &amp; Evening</h2>
          <div className="activities-list">{afternoon.map(renderActivity)}</div>
        </section>
      )}

      <section className="section">
        <h2 className="section-title">Weekly Schedule</h2>
        <div className="weekly-grid">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="day-col">
              <span className="day-label">{day}</span>
              <div className="day-activities">
                {activities.map((s, i) => (
                  <span key={i} className="day-dot" title={s.sport} aria-label={s.sport}>{s.icon}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="weekly-note">Activities repeat weekly unless noted. Check daily dashboard for changes.</p>
      </section>

      <section className="cta-section">
        <h3>Organizing an activity?</h3>
        <p>Share your sports event or activity with the community.</p>
        <Link href="/submit-update" className="cta-button">Submit an Update</Link>
      </section>

      <style jsx>{`
        .sports-hero { background: linear-gradient(135deg, var(--color-sea) 0%, var(--color-sea-light) 100%); color: var(--color-white); padding: var(--sp-6) var(--sp-4); border-radius: var(--radius-lg); margin-bottom: var(--sp-6); }
        .sports-hero h1 { font-size: 32px; font-weight: 700; margin: 0 0 var(--sp-1) 0; color: var(--color-white); }
        .hero-sub { font-size: 15px; opacity: 0.9; margin: 0; }
        .section { margin-bottom: var(--sp-8); }
        .section-title { font-size: 22px; font-weight: 700; color: var(--color-night); margin-bottom: var(--sp-4); }
        .activities-list { display: flex; flex-direction: column; gap: var(--sp-3); }
        .activity-card { background: var(--color-white); border-radius: var(--radius-md); box-shadow: var(--shadow-card); padding: var(--sp-4); display: flex; align-items: center; gap: var(--sp-3); }
        .activity-icon { font-size: 28px; flex-shrink: 0; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; background: var(--color-sea-faint); border-radius: var(--radius-sm); }
        .activity-info { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .activity-name { font-size: 16px; font-weight: 600; color: var(--color-night); }
        .activity-location { font-size: 13px; color: var(--color-desert); }
        .activity-time { font-family: var(--font-data); font-size: 15px; font-weight: 500; color: var(--color-sea); white-space: nowrap; flex-shrink: 0; }
        .weekly-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: var(--sp-2); background: var(--color-white); border-radius: var(--radius-md); box-shadow: var(--shadow-card); padding: var(--sp-4); }
        .day-col { display: flex; flex-direction: column; align-items: center; gap: var(--sp-2); }
        .day-label { font-size: 13px; font-weight: 600; color: var(--color-desert); text-transform: uppercase; }
        .day-activities { display: flex; flex-direction: column; gap: var(--sp-1); align-items: center; }
        .day-dot { font-size: 16px; cursor: default; }
        .weekly-note { font-size: 13px; color: var(--color-desert); margin-top: var(--sp-3); font-style: italic; }
        .cta-section { background: var(--color-sand-light); border-radius: var(--radius-lg); padding: var(--sp-6); text-align: center; }
        .cta-section h3 { font-size: 20px; font-weight: 700; color: var(--color-night); margin: 0 0 var(--sp-2) 0; }
        .cta-section p { font-size: 14px; color: var(--color-desert); margin: 0 0 var(--sp-4) 0; }
        .cta-button { display: inline-block; padding: var(--sp-3) var(--sp-5); background: var(--color-sea); color: var(--color-white); border-radius: var(--radius-md); text-decoration: none; font-weight: 600; font-size: 15px; transition: background 0.15s ease; }
        .cta-button:hover { background: #1560a0; }
        @media (max-width: 640px) { .weekly-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (min-width: 640px) { .sports-hero { padding: var(--sp-8) var(--sp-6); } .sports-hero h1 { font-size: 40px; } }
      `}</style>
    </div>
  );
}
