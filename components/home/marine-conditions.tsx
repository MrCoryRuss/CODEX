"use client";

import Link from "next/link";
import type { MarineSnapshot } from "@/types/weather";

interface Props {
  snapshot: MarineSnapshot;
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

export default function MarineCard({ snapshot, isLive }: Props) {
  const { conditions: c, tides, moon } = snapshot;

  // Sea temp display: show value or "N/A" if source isn't wired yet
  const seaTempDisplay = c.seaTempC !== null ? `${c.seaTempC}°C` : "—";
  const seaTempNote = c.seaTempC === null ? "SST source pending" : "Sea temp";

  return (
    <Link href="/water" className="card-link">
      <section className="card" aria-label="Marine conditions">
        <div className="card-header">
          <span className="card-icon card-icon--sea" aria-hidden="true">🌊</span>
          <span className="card-title">Marine</span>
        </div>

        {/* Top metrics */}
        <div className="marine-metrics">
          <div className="mm-item">
            <span className="mm-val mm-val--lg">{seaTempDisplay}</span>
            <span className="mm-label">{seaTempNote}</span>
          </div>
          <div className="mm-divider" />
          <div className="mm-item">
            <span className="mm-val">{c.waveHeightM}m</span>
            <span className="mm-label">Waves {c.waveDirectionLabel}</span>
          </div>
          <div className="mm-divider" />
          <div className="mm-item">
            <span className="mm-val">{c.swellHeightM}m {c.swellDirectionLabel}</span>
            <span className="mm-label">Swell ({c.swellPeriodS}s)</span>
          </div>
        </div>

        {/* Moon phase */}
        <div className="moon-row">
          <span className="moon-emoji" aria-hidden="true">{moon.emoji}</span>
          <span className="moon-name">{moon.name}</span>
          <span className="moon-pct">{moon.illuminationPct}%</span>
        </div>

        {/* Tide schedule */}
        <h4 className="tide-heading">Today&apos;s tides</h4>
        <div className="tide-list">
          {tides.events.map((t, i) => (
            <div key={i} className="tide-row">
              <span className={`tide-badge tide-badge--${t.type}`}>
                {t.type === "high" ? "▲" : "▼"}
              </span>
              <span className="tide-type">{t.type === "high" ? "High" : "Low"}</span>
              <span className="tide-time">{t.time}</span>
              <span className="tide-height">{t.heightM}m</span>
            </div>
          ))}
        </div>

        <div className="marine-footer">
          <span className="caption">
            {isLive ? "Live" : "Cached"} · Updated {timeAgo(c.fetchedAt)}
          </span>
          <span className="caption marine-tap">Tap for detail →</span>
        </div>
      </section>

      <style jsx>{`
        .marine-metrics {
          display: flex;
          align-items: center;
          gap: var(--sp-3);
          padding: var(--sp-2) 0 var(--sp-3);
          overflow-x: auto;
        }

        .mm-item {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .mm-val {
          font-family: var(--font-data);
          font-size: 15px;
          font-weight: 500;
          color: var(--color-night);
          white-space: nowrap;
        }

        .mm-val--lg {
          font-size: 20px;
        }

        .mm-label {
          font-size: 12px;
          color: var(--color-desert);
          white-space: nowrap;
        }

        .mm-divider {
          width: 1px;
          height: 28px;
          background: var(--color-sand);
          flex-shrink: 0;
        }

        .moon-row {
          display: flex;
          align-items: center;
          gap: var(--sp-2);
          padding: var(--sp-2) 0;
          border-bottom: 1px solid var(--color-sand);
          margin-bottom: var(--sp-3);
        }

        .moon-emoji {
          font-size: 18px;
          line-height: 1;
        }

        .moon-name {
          font-size: 14px;
          font-weight: 500;
          color: var(--color-night);
        }

        .moon-pct {
          font-family: var(--font-data);
          font-size: 13px;
          color: var(--color-desert);
          margin-left: auto;
        }

        .tide-heading {
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--color-desert);
          margin-bottom: var(--sp-2);
        }

        .tide-list {
          display: flex;
          flex-direction: column;
          gap: var(--sp-1);
        }

        .tide-row {
          display: grid;
          grid-template-columns: 20px 40px 1fr auto;
          align-items: center;
          gap: var(--sp-2);
          padding: var(--sp-1) 0;
        }

        .tide-badge {
          font-size: 12px;
          text-align: center;
        }

        .tide-badge--high {
          color: var(--color-sea);
        }

        .tide-badge--low {
          color: var(--color-desert);
        }

        .tide-type {
          font-size: 14px;
          font-weight: 500;
          color: var(--color-night);
        }

        .tide-time {
          font-family: var(--font-data);
          font-size: 14px;
          color: var(--color-night);
        }

        .tide-height {
          font-family: var(--font-data);
          font-size: 14px;
          color: var(--color-desert);
          text-align: right;
        }

        .marine-footer {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-top: var(--sp-2);
        }

        .marine-tap {
          color: var(--color-sea);
          font-weight: 500;
        }
      `}</style>
    </Link>
  );
}
