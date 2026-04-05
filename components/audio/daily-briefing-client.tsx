'use client';

import { AudioPlayerCard } from "@/components/audio";
import type { AudioEpisode } from "@/types/audio-briefing";

interface KM112Today {
  high_f: number;
  high_c: number;
  low_f: number;
  low_c: number;
  desc: string;
  wind: string;
  water_temp_c: number;
}

interface KM112Tides {
  low1?: string;
  high1?: string;
  low2?: string;
  high2?: string;
}

interface KM112Fishing {
  major?: string[];
  minor?: string[];
  rating?: string;
}

interface KM112ForecastDay {
  day: string;
  high_f: number;
  high_c: number;
  low_f: number;
  low_c: number;
  desc: string;
  wind: string;
  rain: boolean;
  clouds: boolean;
}

export interface DailyBriefingProps {
  episode: AudioEpisode | null;
  weather: KM112Today | null;
  tides: KM112Tides | null;
  fishing: KM112Fishing | null;
  forecast: KM112ForecastDay[];
  genTime: string | null;
}

export default function DailyBriefingClient({
  episode,
  weather,
  tides,
  fishing,
  forecast,
  genTime,
}: DailyBriefingProps) {
  return (
    <div className="page-container">

      {/* ── Header ── */}
      <div className="briefing-header">
        <div className="station-badge">📻 KM112 · On Air</div>
        <h1>Daily Briefing</h1>
        <p className="header-subtitle">
          Your morning audio update on weather, tides, and conditions for
          Bahía Concepción. New broadcast generated every day at 1&nbsp;AM.
          {genTime && <span className="gen-time"> Today&apos;s broadcast ready at {genTime}.</span>}
        </p>
      </div>

      {/* ── Audio player ── */}
      {episode ? (
        <section className="latest-section">
          <h2 className="section-title">Today&apos;s Broadcast</h2>
          <AudioPlayerCard episode={episode} featured={true} />
          {episode.transcript && (
            <details className="transcript-details">
              <summary>View Transcript</summary>
              <div className="transcript-content">
                <p>{episode.transcript}</p>
              </div>
            </details>
          )}
        </section>
      ) : (
        <section className="latest-section">
          <div className="no-briefing">
            <p>No briefing available yet. Check back after 1&nbsp;AM.</p>
          </div>
        </section>
      )}

      {/* ── Weather data panels ── */}
      {weather && (
        <div className="data-sections">

          {/* Today */}
          <section className="data-section">
            <h2 className="section-title">☀️ Today — Bahía Concepción</h2>
            <div className="today-grid">
              <div className="stat-card">
                <div className="stat-label">Today&apos;s High</div>
                <div className="stat-value">{weather.high_f}°F</div>
                <div className="stat-sub">{weather.high_c}°C</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Tonight&apos;s Low</div>
                <div className="stat-value">{weather.low_f}°F</div>
                <div className="stat-sub">{weather.low_c}°C</div>
              </div>
              <div className="stat-card wide">
                <div className="stat-label">Conditions &amp; Wind</div>
                <div className="stat-value stat-value--md">{weather.desc}</div>
                <div className="stat-sub">💨 {weather.wind} · 🌊 Water {weather.water_temp_c}°C</div>
              </div>
            </div>
          </section>

          {/* Tides */}
          {tides && (
            <section className="data-section">
              <h2 className="section-title">🌊 Tides</h2>
              <div className="tides-row">
                {tides.low1  && <span className="tide-pill tide-low"><span className="tide-type">Low</span>{tides.low1}</span>}
                {tides.high1 && <span className="tide-pill tide-high"><span className="tide-type">High</span>{tides.high1}</span>}
                {tides.low2  && <span className="tide-pill tide-low"><span className="tide-type">Low</span>{tides.low2}</span>}
                {tides.high2 && <span className="tide-pill tide-high"><span className="tide-type">High</span>{tides.high2}</span>}
              </div>
            </section>
          )}

          {/* Fishing */}
          {fishing && (
            <section className="data-section">
              <h2 className="section-title">🎣 Fishing Report</h2>
              <div className="card fishing-card">
                {fishing.major?.map((window, i) => (
                  <div key={i} className="fish-row">
                    <span className="fish-dot fish-dot--major" />
                    <span className="fish-label">Major</span>
                    <span className="fish-time">{window}</span>
                  </div>
                ))}
                {fishing.minor?.map((window, i) => (
                  <div key={i} className="fish-row">
                    <span className="fish-dot fish-dot--minor" />
                    <span className="fish-label">Minor</span>
                    <span className="fish-time">{window}</span>
                  </div>
                ))}
                {fishing.rating && (
                  <div className="fish-rating">
                    Overall: <strong>{fishing.rating} fishing day</strong>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 3-day forecast */}
          {forecast?.length > 0 && (
            <section className="data-section">
              <h2 className="section-title">📅 3-Day Outlook</h2>
              <div className="forecast-grid">
                {forecast.map((day) => (
                  <div key={day.day} className={`forecast-card card${day.rain ? ' forecast-card--rain' : ''}`}>
                    <div className="fc-day">
                      {day.rain ? '🌧️' : day.clouds ? '⛅' : '☀️'} {day.day}
                    </div>
                    <div className="fc-temps">
                      <span className="fc-high">{day.high_f}°F <span className="fc-c">/ {day.high_c}°C</span></span>
                      <span className="fc-sep">→</span>
                      <span className="fc-low">{day.low_f}°F <span className="fc-c">/ {day.low_c}°C</span></span>
                    </div>
                    <div className="fc-wind">💨 {day.wind}</div>
                    {(day.rain || day.clouds) && (
                      <div className="fc-note">{day.rain ? 'Rain expected' : 'Some clouds'}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      )}

      <style jsx>{`
        .page-container {
          max-width: 900px;
          margin: 0 auto;
          padding: var(--sp-4);
        }
        .briefing-header {
          background: linear-gradient(135deg, var(--color-sea) 0%, #0e4d72 100%);
          color: var(--color-white);
          padding: var(--sp-6) var(--sp-4);
          border-radius: var(--radius-lg);
          margin-bottom: var(--sp-7);
        }
        .station-badge {
          display: inline-block;
          background: rgba(255,255,255,0.18);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          margin-bottom: var(--sp-3);
        }
        .briefing-header h1 {
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 var(--sp-2) 0;
          color: var(--color-white);
        }
        .header-subtitle {
          font-size: 15px;
          margin: 0;
          opacity: 0.9;
          max-width: 600px;
          line-height: 1.6;
        }
        .gen-time { opacity: 0.75; font-size: 13px; }
        .latest-section { margin-bottom: var(--sp-8); }
        .data-sections { display: flex; flex-direction: column; gap: var(--sp-7); }
        .section-title {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: var(--sp-4);
          color: var(--color-night);
        }
        .no-briefing {
          background: var(--color-sand);
          border-radius: var(--radius-md);
          padding: var(--sp-6);
          text-align: center;
          color: var(--color-desert);
        }
        .transcript-details {
          margin-top: var(--sp-4);
          padding: var(--sp-4);
          background: var(--color-sand);
          border-radius: var(--radius-md);
        }
        .transcript-details summary {
          cursor: pointer;
          font-weight: 600;
          color: var(--color-sea);
          padding: var(--sp-2);
          user-select: none;
        }
        .transcript-content {
          margin-top: var(--sp-3);
          padding-top: var(--sp-3);
          border-top: 1px solid rgba(0,0,0,0.08);
        }
        .transcript-content p {
          font-size: 14px;
          line-height: 1.7;
          color: var(--color-night);
          margin: 0;
          white-space: pre-wrap;
        }
        /* Today */
        .today-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--sp-3);
        }
        .stat-card {
          background: var(--color-sand);
          border-radius: var(--radius-md);
          padding: var(--sp-4);
        }
        .stat-card.wide { grid-column: span 2; }
        .stat-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-desert);
          margin-bottom: var(--sp-1);
        }
        .stat-value {
          font-family: var(--font-data);
          font-size: 28px;
          font-weight: 700;
          color: var(--color-night);
          line-height: 1.1;
        }
        .stat-value--md { font-size: 20px; }
        .stat-sub { font-size: 13px; color: var(--color-desert); margin-top: var(--sp-1); }
        /* Tides */
        .tides-row { display: flex; flex-wrap: wrap; gap: var(--sp-2); }
        .tide-pill {
          display: flex;
          flex-direction: column;
          padding: var(--sp-2) var(--sp-3);
          border-radius: var(--radius-sm);
          font-family: var(--font-data);
          font-size: 15px;
          font-weight: 600;
        }
        .tide-type {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 2px;
          font-family: var(--font-body);
        }
        .tide-low { background: var(--color-sand); color: var(--color-night); }
        .tide-low .tide-type { color: var(--color-sea); }
        .tide-high { background: var(--color-sea); color: var(--color-white); }
        .tide-high .tide-type { color: rgba(255,255,255,0.75); }
        /* Fishing */
        .fishing-card { display: flex; flex-direction: column; gap: var(--sp-2); }
        .fish-row { display: flex; align-items: center; gap: var(--sp-2); font-size: 14px; }
        .fish-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .fish-dot--major { background: var(--color-sea); }
        .fish-dot--minor { background: var(--color-sun); }
        .fish-label { font-weight: 600; color: var(--color-night); min-width: 48px; font-size: 13px; }
        .fish-time { font-family: var(--font-data); color: var(--color-desert); }
        .fish-rating {
          margin-top: var(--sp-2);
          padding-top: var(--sp-2);
          border-top: 1px solid var(--color-sand);
          font-size: 14px;
          color: var(--color-desert);
        }
        .fish-rating strong { color: var(--color-night); }
        /* Forecast */
        .forecast-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-3); }
        .forecast-card { padding: var(--sp-4); }
        .forecast-card--rain { border-left: 3px solid var(--color-sea); }
        .fc-day { font-size: 16px; font-weight: 700; color: var(--color-night); margin-bottom: var(--sp-2); }
        .fc-temps {
          display: flex; align-items: center; gap: var(--sp-2);
          font-family: var(--font-data); font-size: 15px;
          margin-bottom: var(--sp-2); flex-wrap: wrap;
        }
        .fc-high { color: var(--color-night); font-weight: 600; }
        .fc-low  { color: var(--color-desert); }
        .fc-c    { font-size: 13px; color: var(--color-desert); font-weight: 400; }
        .fc-sep  { color: var(--color-desert); }
        .fc-wind { font-size: 13px; color: var(--color-desert); margin-bottom: var(--sp-1); }
        .fc-note { font-size: 12px; color: var(--color-sea); font-weight: 600; margin-top: var(--sp-1); }
        /* Responsive */
        @media (min-width: 640px) {
          .page-container { padding: var(--sp-6); }
          .briefing-header { padding: var(--sp-8) var(--sp-6); }
          .briefing-header h1 { font-size: 40px; }
          .section-title { font-size: 24px; }
        }
        @media (max-width: 480px) {
          .today-grid { grid-template-columns: 1fr; }
          .stat-card.wide { grid-column: span 1; }
          .forecast-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
