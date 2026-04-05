"use client";

import Link from "next/link";
import type { CurrentConditions } from "@/types/weather";
import { resolveWeatherCode } from "@/types/weather";

interface Props { conditions: CurrentConditions; isLive: boolean; }

function toF(c: number) { return Math.round(c * 9 / 5 + 32); }
function toMph(kts: number) { return Math.round(kts * 1.151); }

function timeAgo(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

export default function WeatherHero({ conditions: c, isLive }: Props) {
  const { icon, label } = resolveWeatherCode(c.weatherCode, c.isDay);
  const tempF = toF(c.tempC);
  const feelsF = toF(c.feelsLikeC);
  const windMph = toMph(c.windSpeedKts);
  const gustMph = toMph(c.windGustsKts);
  const uvLabel = c.uvIndex >= 8 ? "Very High" : c.uvIndex >= 6 ? "High" : c.uvIndex >= 3 ? "Moderate" : "Low";

  return (
    <section className="hero" aria-label="Current conditions">
      {/* Top row: temp + icon */}
      <div className="hero-top">
        <div className="hero-left">
          <span className="weather-icon" aria-hidden="true">{icon}</span>
          <div>
            <div className="temp-primary">{tempF}°<span className="temp-f">F</span> <span className="temp-c">/ {c.tempC}°C</span></div>
            <div className="temp-secondary">Feels {feelsF}°F / {c.feelsLikeC}°C</div>
            <div className="condition">{label}</div>
          </div>
        </div>
        <Link href="/weather" className="detail-link">Forecast →</Link>
      </div>

      {/* Metrics row */}
      <div className="metrics">
        <div className="metric">
          <span className="m-icon">💨</span>
          <div>
            <span className="m-val">{windMph} <span className="m-unit">mph</span> <span className="m-alt">/ {c.windSpeedKts} kts</span></span>
            {gustMph > windMph + 4 && <span className="m-gust">G {gustMph} mph</span>}
            <span className="m-label">{c.windDirectionLabel}</span>
          </div>
        </div>
        <div className="m-div" />
        <div className="metric">
          <span className="m-icon">☀️</span>
          <div>
            <span className="m-val">{c.uvIndex}</span>
            <span className="m-label">UV · {uvLabel}</span>
          </div>
        </div>
        <div className="m-div" />
        <div className="metric">
          <span className="m-icon">💧</span>
          <div>
            <span className="m-val">{c.humidity}<span className="m-unit">%</span></span>
            <span className="m-label">Humidity</span>
          </div>
        </div>
        <div className="m-div" />
        <div className="metric">
          <span className="m-icon">🌡️</span>
          <div>
            <span className="m-val">{c.pressureHpa}</span>
            <span className="m-label">hPa</span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="hero-status">
        <span className={`dot ${isLive ? "dot-live" : "dot-cached"}`} />
        <span className="status-text">{isLive ? "Live" : "Cached"} · {timeAgo(c.fetchedAt)}</span>
      </div>

      <style jsx>{`
        .hero {
          background: var(--color-surface);
          border-radius: var(--radius-xl);
          padding: var(--sp-5);
          margin-bottom: var(--sp-4);
          box-shadow: var(--shadow-card);
          border: 1px solid var(--color-border-light);
        }
        .hero-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--sp-4);
        }
        .hero-left {
          display: flex;
          align-items: center;
          gap: var(--sp-3);
        }
        .weather-icon { font-size: 52px; line-height: 1; }
        .temp-primary {
          font-family: var(--font-data);
          font-size: 52px;
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1;
          color: var(--color-text);
        }
        .temp-f { font-size: 28px; font-weight: 400; color: var(--color-text-secondary); }
        .temp-c { font-size: 22px; font-weight: 400; color: var(--color-text-muted); }
        .m-alt { font-size: 12px; font-weight: 400; color: var(--color-text-muted); margin-left: 2px; }
        .temp-secondary { font-size: 13px; color: var(--color-text-muted); margin-top: 4px; }
        .condition { font-size: 16px; font-weight: 600; color: var(--color-text); margin-top: 2px; }
        .detail-link {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-sea);
          text-decoration: none;
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          white-space: nowrap;
          transition: background 0.15s;
        }
        .detail-link:hover { background: var(--color-sea-faint); text-decoration: none; }
        /* Metrics */
        .metrics {
          display: flex;
          align-items: center;
          gap: var(--sp-3);
          padding: var(--sp-3) var(--sp-4);
          background: var(--color-surface-alt);
          border-radius: var(--radius-md);
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .metrics::-webkit-scrollbar { display: none; }
        .metric {
          display: flex;
          align-items: center;
          gap: var(--sp-2);
          flex: 1;
          min-width: 0;
        }
        .m-icon { font-size: 18px; flex-shrink: 0; }
        .m-val {
          font-family: var(--font-data);
          font-size: 18px;
          font-weight: 600;
          color: var(--color-text);
          line-height: 1.2;
          display: block;
          white-space: nowrap;
        }
        .m-unit { font-size: 12px; font-weight: 400; color: var(--color-text-secondary); }
        .m-gust { font-size: 12px; color: var(--color-sun); font-family: var(--font-data); margin-left: 4px; }
        .m-label { font-size: 11px; color: var(--color-text-muted); display: block; white-space: nowrap; }
        .m-div { width: 1px; height: 30px; background: var(--color-border); flex-shrink: 0; }
        /* Status */
        .hero-status {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: var(--sp-3);
          padding-top: var(--sp-3);
          border-top: 1px solid var(--color-border-light);
        }
        .dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .dot-live { background: var(--color-success); animation: pulse 2s ease-in-out infinite; }
        .dot-cached { background: var(--color-sun); }
        .status-text { font-size: 12px; color: var(--color-text-muted); }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.3} }
        @media (min-width: 640px) {
          .weather-icon { font-size: 64px; }
          .temp-primary { font-size: 64px; }
          .temp-f { font-size: 36px; }
        }
      `}</style>
    </section>
  );
}
