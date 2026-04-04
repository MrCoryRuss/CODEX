"use client";

import Link from "next/link";
import type { MarineSnapshot } from "@/types/weather";

interface Props { snapshot: MarineSnapshot; isLive: boolean; }

function toFt(m: number) { return (m * 3.281).toFixed(1); }

export default function CompactMarine({ snapshot: s, isLive }: Props) {
  const c = s.conditions;
  const nextTide = s.tides?.events?.[0];

  return (
    <Link href="/water" className="card-link">
      <section className="card marine-card" aria-label="Marine conditions">
        <div className="card-header">
          <span className="card-icon card-icon--sea" aria-hidden="true">🌊</span>
          <span className="card-title">Marine</span>
          <span className={`live-dot ${isLive ? "live" : "cached"}`} />
        </div>

        <div className="grid">
          <div className="stat">
            <span className="stat-val">{toFt(c.waveHeightM)}<span className="stat-unit">ft</span></span>
            <span className="stat-label">Waves</span>
          </div>
          <div className="stat">
            <span className="stat-val">{toFt(c.swellHeightM)}<span className="stat-unit">ft</span></span>
            <span className="stat-label">Swell {c.swellDirectionLabel}</span>
          </div>
          <div className="stat">
            <span className="stat-val">{s.moon.emoji}</span>
            <span className="stat-label">{s.moon.name} {s.moon.illuminationPct}%</span>
          </div>
          <div className="stat">
            {nextTide ? (
              <>
                <span className="stat-val tide-val">
                  {nextTide.type === "high" ? "▲" : "▼"} {nextTide.time}
                </span>
                <span className="stat-label">{nextTide.type === "high" ? "High" : "Low"} tide · {toFt(nextTide.heightM)}ft</span>
              </>
            ) : (
              <>
                <span className="stat-val">—</span>
                <span className="stat-label">Tides</span>
              </>
            )}
          </div>
        </div>

        <span className="tap-hint">Tap for full detail →</span>
      </section>

      <style jsx>{`
        .marine-card { height: 100%; }
        .live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          margin-left: auto; flex-shrink: 0;
        }
        .live { background: var(--color-success); }
        .cached { background: var(--color-sun); }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--sp-3);
          margin: var(--sp-3) 0;
        }
        .stat { display: flex; flex-direction: column; gap: 2px; }
        .stat-val {
          font-family: var(--font-data);
          font-size: 22px;
          font-weight: 600;
          color: var(--color-text);
          line-height: 1.2;
        }
        .stat-unit { font-size: 13px; font-weight: 400; color: var(--color-text-secondary); margin-left: 2px; }
        .stat-label { font-size: 12px; color: var(--color-text-muted); }
        .tide-val { font-size: 16px; }
        .tap-hint {
          font-size: 13px;
          font-weight: 500;
          color: var(--color-sea);
          display: block;
          margin-top: var(--sp-2);
        }
      `}</style>
    </Link>
  );
}
