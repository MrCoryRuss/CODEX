"use client";

import type { CurrentConditions } from "@/types/weather";
import { resolveWeatherCode } from "@/types/weather";

interface Props {
  conditions: CurrentConditions;
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

export default function QuickStats({ conditions, isLive }: Props) {
  const c = conditions;
  const { icon: weatherIcon } = resolveWeatherCode(c.weatherCode, c.isDay);

  const pills = [
    { label: "Now",  value: `${c.tempC}°`, sub: c.weatherLabel, icon: weatherIcon },
    { label: "Wind", value: `${c.windSpeedKts}`, sub: `kts ${c.windDirectionLabel}`, icon: "💨" },
    { label: "Gust", value: `${c.windGustsKts}`, sub: "kts", icon: "🌬" },
    { label: "UV",   value: `${c.uvIndex}`, sub: c.uvIndex >= 8 ? "Very high" : c.uvIndex >= 6 ? "High" : "Moderate", icon: "🔆" },
  ];

  return (
    <section className="quick-stats-wrap" aria-label="Current conditions at a glance">
      <div className="quick-stats">
        {pills.map((p) => (
          <div key={p.label} className="qs-item">
            <span className="qs-icon" aria-hidden="true">{p.icon}</span>
            <div className="qs-content">
              <span className="qs-value">{p.value}</span>
              <span className="qs-sub">{p.sub}</span>
              <span className="qs-label">{p.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="qs-meta">
        <span className={`qs-status ${isLive ? "qs-status--live" : "qs-status--cached"}`}>
          {isLive ? "● Live" : "○ Cached"}
        </span>
        <span className="qs-updated">Updated {timeAgo(c.fetchedAt)}</span>
      </div>

      <style jsx>{`
        .quick-stats-wrap {
          margin-bottom: var(--sp-3);
        }

        .quick-stats {
          display: flex;
          gap: var(--sp-2);
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding: var(--sp-1) 0;
        }

        .quick-stats::-webkit-scrollbar {
          display: none;
        }

        .qs-item {
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: center;
          gap: var(--sp-2);
          background: var(--color-white);
          border-radius: var(--radius-md);
          padding: var(--sp-3);
          box-shadow: var(--shadow-card);
        }

        .qs-icon {
          font-size: 20px;
          line-height: 1;
          flex-shrink: 0;
        }

        .qs-content {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .qs-value {
          font-family: var(--font-data);
          font-size: 16px;
          font-weight: 500;
          color: var(--color-night);
          white-space: nowrap;
        }

        .qs-sub {
          font-size: 12px;
          color: var(--color-desert);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .qs-label {
          font-size: 11px;
          color: var(--color-desert);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-weight: 600;
        }

        .qs-meta {
          display: flex;
          align-items: center;
          gap: var(--sp-2);
          padding: var(--sp-1) var(--sp-1) 0;
        }

        .qs-status {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .qs-status--live {
          color: #3a8f5c;
        }

        .qs-status--cached {
          color: var(--color-sun);
        }

        .qs-updated {
          font-size: 12px;
          color: var(--color-desert);
        }

        @media (min-width: 640px) {
          .qs-item {
            padding: var(--sp-3) var(--sp-4);
          }

          .qs-value {
            font-size: 18px;
          }
        }
      `}</style>
    </section>
  );
}
