"use client";

import Link from "next/link";
import type { ForecastDay } from "@/types/weather";

interface Props {
  days: ForecastDay[];
  fetchedAt: string;
  isLive: boolean;
}

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function ForecastCard({ days, fetchedAt, isLive }: Props) {
  return (
    <Link href="/weather" className="card-link">
      <section className="card" aria-label="Daily forecast">
        <div className="card-header">
          <span className="card-icon card-icon--sun" aria-hidden="true">☀️</span>
          <span className="card-title">Forecast</span>
        </div>

        <div className="forecast-list">
          {days.map((d) => (
            <div key={d.date} className="fc-row">
              <span className="fc-day">{d.dayLabel}</span>
              <span className="fc-icon" aria-label={d.weatherLabel}>{d.weatherIcon}</span>
              <span className="fc-range">
                <span className="fc-high">{d.highC}°</span>
                <span className="fc-low">{d.lowC}°</span>
              </span>
              <span className="fc-wind">{d.windMaxKts}kt {d.windDominantDir}</span>
            </div>
          ))}
        </div>

        <div className="fc-footer">
          <span className="caption">
            {isLive ? "Live" : "Cached"} · Updated {timeAgo(fetchedAt)}
          </span>
          <span className="caption fc-tap">Tap for detail →</span>
        </div>
      </section>

      <style jsx>{`
        .forecast-list {
          display: flex;
          flex-direction: column;
        }

        .fc-row {
          display: grid;
          grid-template-columns: 36px 28px 1fr auto;
          align-items: center;
          gap: var(--sp-2);
          padding: var(--sp-2) 0;
          border-bottom: 1px solid var(--color-sand);
        }

        .fc-row:last-child {
          border-bottom: none;
        }

        .fc-day {
          font-size: 15px;
          font-weight: 600;
          color: var(--color-night);
        }

        .fc-icon {
          font-size: 18px;
          text-align: center;
        }

        .fc-range {
          display: flex;
          gap: var(--sp-2);
          font-family: var(--font-data);
          font-size: 15px;
          font-weight: 500;
        }

        .fc-high {
          color: var(--color-night);
        }

        .fc-low {
          color: var(--color-desert);
        }

        .fc-wind {
          font-family: var(--font-data);
          font-size: 13px;
          color: var(--color-desert);
          text-align: right;
          white-space: nowrap;
        }

        .fc-footer {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-top: var(--sp-2);
        }

        .fc-tap {
          color: var(--color-sea);
          font-weight: 500;
        }
      `}</style>
    </Link>
  );
}
