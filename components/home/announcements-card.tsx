"use client";

import type { Announcement } from "./mock-data";

const LEVEL_STYLES: Record<Announcement["level"], { bg: string; border: string; icon: string }> = {
  info:    { bg: "var(--color-sea-faint)", border: "var(--color-sea-light)", icon: "ℹ️"  },
  warning: { bg: "var(--color-sun-light)", border: "var(--color-sun)",       icon: "⚠️" },
  urgent:  { bg: "var(--color-danger-light)", border: "var(--color-danger)", icon: "🚨" },
};

interface Props {
  items: Announcement[];
}

export default function AnnouncementsCard({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="card" aria-label="Community announcements">
      <div className="card-header">
        <span className="card-icon card-icon--sun" aria-hidden="true">📢</span>
        <span className="card-title">Announcements</span>
      </div>

      <div className="ann-list">
        {items.map((a) => {
          const style = LEVEL_STYLES[a.level];
          return (
            <div
              key={a.id}
              className="ann-item"
              style={{
                background: style.bg,
                borderLeft: `3px solid ${style.border}`,
              }}
            >
              <div className="ann-top">
                <span className="ann-icon" aria-hidden="true">{style.icon}</span>
                <span className="ann-date">{a.date}</span>
              </div>
              <p className="ann-text">{a.text}</p>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .ann-list {
          display: flex;
          flex-direction: column;
          gap: var(--sp-2);
        }

        .ann-item {
          border-radius: var(--radius-sm);
          padding: var(--sp-3);
        }

        .ann-top {
          display: flex;
          align-items: center;
          gap: var(--sp-2);
          margin-bottom: var(--sp-1);
        }

        .ann-icon {
          font-size: 14px;
          line-height: 1;
        }

        .ann-date {
          font-size: 12px;
          font-weight: 600;
          color: var(--color-desert);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .ann-text {
          font-size: 15px;
          line-height: 1.45;
          color: var(--color-night);
        }
      `}</style>
    </section>
  );
}
