import Link from "next/link";
import type { SportItem } from "./mock-data";

interface Props {
  items: SportItem[];
}

export default function SportsCard({ items }: Props) {
  return (
    <Link href="/sports" className="card-link">
      <section className="card" aria-label="Sports today">
        <div className="card-header">
          <span className="card-icon card-icon--sun" aria-hidden="true">🏐</span>
          <span className="card-title">Sports Today</span>
        </div>

        <div className="sports-list">
          {items.map((s, i) => (
            <div key={i} className="sp-row">
              <span className={`sp-dot sp-dot--${s.dotColor}`} aria-hidden="true" />
              <div className="sp-info">
                <span className="sp-name">
                  <span className="sp-icon" aria-hidden="true">{s.icon}</span>
                  {s.sport}
                </span>
                <span className="sp-location">{s.location}</span>
              </div>
              <span className="sp-time">{s.time}</span>
            </div>
          ))}
        </div>

        <p className="caption sp-footer">Tap for full weekly schedule</p>
      </section>

      <style jsx>{`
        .sports-list {
          display: flex;
          flex-direction: column;
        }

        .sp-row {
          display: flex;
          align-items: center;
          gap: var(--sp-3);
          padding: var(--sp-2) 0;
          border-bottom: 1px solid var(--color-sand);
        }

        .sp-row:last-child {
          border-bottom: none;
        }

        .sp-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .sp-dot--sea { background: var(--color-sea); }
        .sp-dot--sun { background: var(--color-sun); }
        .sp-dot--danger { background: var(--color-danger); }

        .sp-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .sp-name {
          font-size: 15px;
          font-weight: 500;
          color: var(--color-night);
          display: flex;
          align-items: center;
          gap: var(--sp-1);
        }

        .sp-icon {
          font-size: 14px;
        }

        .sp-location {
          font-size: 13px;
          color: var(--color-desert);
        }

        .sp-time {
          font-family: var(--font-data);
          font-size: 13px;
          font-weight: 500;
          color: var(--color-sea);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .sp-footer {
          margin-top: var(--sp-2);
        }
      `}</style>
    </Link>
  );
}
