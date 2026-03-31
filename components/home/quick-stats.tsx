"use client";
import Link from "next/link";
import type { CurrentConditions } from "@/types/weather";
import { resolveWeatherCode } from "@/types/weather";
interface Props { conditions: CurrentConditions; isLive: boolean; }
function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
export default function QuickStats({ conditions, isLive }: Props) {
  const c = conditions;
  const { icon: weatherIcon, label: weatherLabel } = resolveWeatherCode(c.weatherCode, c.isDay);
  return (
    <section className="weather-hero" aria-label="Current weather conditions">
      <div className="hero-main">
        <div className="hero-temp-block">
          <span className="hero-icon" aria-hidden="true">{weatherIcon}</span>
          <div className="hero-temp-info">
            <span className="hero-temp">{c.tempC}&deg;</span>
            <span className="hero-condition">{weatherLabel}</span>
            <span className="hero-feels">Feels like {c.feelsLikeC}&deg;C</span>
          </div>
        </div>
        <Link href="/weather" className="hero-detail-link">Full forecast &rarr;</Link>
      </div>
      <div className="metrics-strip">
        <div className="metric"><span className="metric-icon">&#x1F4A8;</span><div className="metric-data"><span className="metric-value">{c.windSpeedKts}<span className="metric-unit">kts</span></span><span className="metric-label">Wind {c.windDirectionLabel}</span></div></div>
        <div className="metric-divider" />
        <div className="metric"><span className="metric-icon">&#x1F32C;</span><div className="metric-data"><span className="metric-value">{c.windGustsKts}<span className="metric-unit">kts</span></span><span className="metric-label">Gusts</span></div></div>
        <div className="metric-divider" />
        <div className="metric"><span className="metric-icon">&#x2600;&#xFE0F;</span><div className="metric-data"><span className="metric-value">{c.uvIndex}</span><span className="metric-label">UV {c.uvIndex >= 8 ? "Very High" : c.uvIndex >= 6 ? "High" : c.uvIndex >= 3 ? "Moderate" : "Low"}</span></div></div>
        <div className="metric-divider" />
        <div className="metric"><span className="metric-icon">&#x1F4A7;</span><div className="metric-data"><span className="metric-value">{c.humidity}<span className="metric-unit">%</span></span><span className="metric-label">Humidity</span></div></div>
      </div>
      <div className="hero-status">
        <span className={`status-badge ${isLive ? "status-badge--live" : "status-badge--cached"}`}><span className="status-dot" />{isLive ? "Live data" : "Cached"}</span>
        <span className="status-time">Updated {timeAgo(c.fetchedAt)}</span>
      </div>
      <style jsx>{`
        .weather-hero { background: var(--color-surface); border-radius: var(--radius-xl); padding: var(--sp-5); margin-bottom: var(--sp-5); box-shadow: var(--shadow-card); border: 1px solid var(--color-border-light); }
        .hero-main { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--sp-5); }
        .hero-temp-block { display: flex; align-items: center; gap: var(--sp-4); }
        .hero-icon { font-size: 48px; line-height: 1; }
        .hero-temp-info { display: flex; flex-direction: column; }
        .hero-temp { font-family: var(--font-data); font-size: 48px; font-weight: 600; color: var(--color-text); line-height: 1; letter-spacing: -0.03em; }
        .hero-condition { font-size: 16px; font-weight: 600; color: var(--color-text); margin-top: 4px; }
        .hero-feels { font-size: 13px; color: var(--color-text-muted); margin-top: 2px; }
        .hero-detail-link { font-size: 13px; font-weight: 600; color: var(--color-primary); text-decoration: none; white-space: nowrap; padding: 6px 12px; border-radius: var(--radius-sm); transition: background 0.15s ease; }
        .hero-detail-link:hover { background: var(--color-primary-soft); text-decoration: none; }
        .metrics-strip { display: flex; align-items: center; gap: var(--sp-3); padding: var(--sp-4); background: var(--color-surface-alt); border-radius: var(--radius-md); overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
        .metrics-strip::-webkit-scrollbar { display: none; }
        .metric { display: flex; align-items: center; gap: var(--sp-2); flex: 1; min-width: 0; }
        .metric-icon { font-size: 20px; flex-shrink: 0; }
        .metric-data { display: flex; flex-direction: column; min-width: 0; }
        .metric-value { font-family: var(--font-data); font-size: 18px; font-weight: 600; color: var(--color-text); white-space: nowrap; line-height: 1.2; }
        .metric-unit { font-size: 12px; font-weight: 400; color: var(--color-text-secondary); margin-left: 2px; }
        .metric-label { font-size: 12px; color: var(--color-text-muted); white-space: nowrap; }
        .metric-divider { width: 1px; height: 32px; background: var(--color-border); flex-shrink: 0; }
        .hero-status { display: flex; align-items: center; gap: var(--sp-3); margin-top: var(--sp-4); padding-top: var(--sp-3); border-top: 1px solid var(--color-border-light); }
        .status-badge { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; letter-spacing: 0.02em; }
        .status-badge--live { color: var(--color-success); }
        .status-badge--cached { color: var(--color-sun); }
        .status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
        .status-badge--live .status-dot { animation: pulse 2s ease-in-out infinite; }
        .status-time { font-size: 12px; color: var(--color-text-muted); }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @media (min-width: 640px) { .weather-hero { padding: var(--sp-6); } .hero-icon { font-size: 56px; } .hero-temp { font-size: 56px; } .hero-condition { font-size: 18px; } .metric-value { font-size: 20px; } }
      `}</style>
    </section>
  );
}
