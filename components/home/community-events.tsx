'use client';
import Link from "next/link";
import type { EventItem } from "./mock-data";

const CATEGORY_COLORS: Record<EventItem["category"], string> = {
  social:  "sun",
  service: "sea",
  market:  "desert",
  medical: "danger",
};

const CATEGORY_LABELS: Record<EventItem["category"], string> = {
  social:  "Social",
  service: "Service",
  market:  "Market",
  medical: "Medical",
};

interface Props {
  items: EventItem[];
}

export default function EventsCard({ items }: Props) {
  return (
    <Link href="/events" className="card-link">
      <section className="card" aria-label="Community events">
        <div className="card-header">
          <span className="card-icon card-icon--sun" aria-hidden="true">📅</span>
          <span className="card-title">Community Events</span>
        </div>

        <div className="events-list">
          {items.map((e, i) => {
            const color = CATEGORY_COLORS[e.category];
            return (
              <div key={i} className="ev-row">
                <span
                  className="ev-dot"
                  style={{ background: `var(--color-${color})` }}
                  aria-label={CATEGORY_LABELS[e.category]}
                />
                <div className="ev-info">
                  <span className="ev-title">{e.title}</span>
                  <span className="ev-location">{e.location}</span>
                </div>
                <span className="ev-time">{e.time}</span>
              </div>
            );
          })}
        </div>

        <p className="caption ev-footer">Tap to see full calendar</p>
      </section>

      <style jsx>{`
        .events-list {
          display: flex;
          flex-direction: column;
        }

        .ev-row {
          display: flex;
          align-items: center;
          gap: var(--sp-3);
          padding: var(--sp-2) 0;
          border-bottom: 1px solid var(--color-sand);
        }

        .ev-row:last-child {
          border-bottom: none;
        }

        .ev-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .ev-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .ev-title {
          font-size: 15px;
          font-weight: 500;
          color: var(--color-night);
        }

        .ev-location {
          font-size: 13px;
          color: var(--color-desert);
        }

        .ev-time {
          font-family: var(--font-data);
          font-size: 13px;
          font-weight: 500;
          color: var(--color-sea);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .ev-footer {
          margin-top: var(--sp-2);
        }
      `}</style>
    </Link>
  );
}
