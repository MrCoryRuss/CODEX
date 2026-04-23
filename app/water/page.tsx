'use client';

import { useState, useEffect } from 'react';
import { fetchMarineSnapshot } from "@/lib/marine";
import type { MarineSnapshot } from "@/types/weather";

export default function WaterPage() {
  const [snapshot, setSnapshot] = useState<MarineSnapshot | null>(null);

  useEffect(() => {
    fetchMarineSnapshot().then(setSnapshot);
  }, []);

  if (!snapshot) {
    return (
      <div className="page-container">
        <div className="loading">Loading marine data...</div>
      </div>
    );
  }

  const { conditions: c, tides, moon } = snapshot;

  // Build tide bar chart data: normalize heights to 0-100%
  const allHeights = [
    ...tides.events.map((e) => e.heightFt ?? e.heightM * 3.28084),
    ...(tides.forecast ?? []).flatMap((d) => d.events.map((e) => e.heightFt ?? e.heightM * 3.28084)),
  ];
  const minH = Math.min(...allHeights, -1.5);
  const maxH = Math.max(...allHeights, 2.5);
  const heightToBar = (ft: number) => Math.max(5, Math.round(((ft - minH) / (maxH - minH)) * 100));

  return (
    <div className="page-container">
      <div className="water-hero">
        <h1>Water &amp; Marine</h1>
        <p className="hero-sub">Bahía Concepción, BCS · Live conditions</p>
      </div>

      {/* Current Conditions */}
      <section className="section">
        <h2 className="section-title">Current Conditions</h2>
        <div className="conditions-grid">
          <div className="cond-card">
            <span className="cond-icon" aria-hidden="true">🌡️</span>
            <span className="cond-label">Sea Temperature</span>
            <span className="cond-value">{c.seaTempC !== null ? `${c.seaTempC}°C` : "—"}</span>
            {c.seaTempC === null && <span className="cond-sub">Source pending</span>}
          </div>
          <div className="cond-card">
            <span className="cond-icon" aria-hidden="true">🌊</span>
            <span className="cond-label">Wave Height</span>
            <span className="cond-value">{(c.waveHeightM * 3.28084).toFixed(1)} ft</span>
            <span className="cond-sub">{c.waveDirectionLabel}</span>
          </div>
          <div className="cond-card">
            <span className="cond-icon" aria-hidden="true">〰️</span>
            <span className="cond-label">Swell</span>
            <span className="cond-value">{(c.swellHeightM * 3.28084).toFixed(1)} ft</span>
            <span className="cond-sub">{c.swellDirectionLabel} · {c.swellPeriodS}s period</span>
          </div>
          <div className="cond-card">
            <span className="cond-icon" aria-hidden="true">⏱️</span>
            <span className="cond-label">Wave Period</span>
            <span className="cond-value">{c.wavePeriodS}s</span>
            <span className="cond-sub">Dominant period</span>
          </div>
        </div>
      </section>

      {/* Today's Tides */}
      <section className="section">
        <div className="tide-header">
          <h2 className="section-title">Today&apos;s Tides</h2>
          {tides.isLive ? (
            <span className="live-badge">● Live</span>
          ) : (
            <span className="mock-badge">Estimated</span>
          )}
        </div>

        {tides.events.length > 0 ? (
          <>
            {/* Visual tide bar chart */}
            <div className="tide-chart">
              {tides.events.map((t, i) => {
                const ft = t.heightFt ?? Math.round(t.heightM * 32.8084) / 10;
                const barPct = heightToBar(ft);
                return (
                  <div key={i} className="tide-bar-wrap">
                    <div className="tide-bar-label-top">
                      <span className={`tide-type-badge ${t.type}`}>
                        {t.type === 'high' ? '▲' : '▼'}
                      </span>
                      <span className="tide-bar-ft">{ft > 0 ? '+' : ''}{ft.toFixed(1)} ft</span>
                    </div>
                    <div className="tide-bar-track">
                      <div
                        className={`tide-bar-fill ${t.type}`}
                        style={{ height: `${barPct}%` }}
                      />
                    </div>
                    <div className="tide-bar-time">{t.time}</div>
                  </div>
                );
              })}
            </div>

            {/* Tide table */}
            <div className="tide-card">
              {tides.events.map((t, i) => {
                const ft = t.heightFt ?? Math.round(t.heightM * 32.8084) / 10;
                return (
                  <div key={i} className="tide-row">
                    <span className={`tide-badge tide-badge--${t.type}`}>
                      {t.type === 'high' ? '▲ High' : '▼ Low'}
                    </span>
                    <span className="tide-time">{t.time}</span>
                    <span className="tide-height">
                      <span className="tide-ht-ft">{ft > 0 ? '+' : ''}{ft.toFixed(1)} ft</span>
                      <span className="tide-ht-m">{t.heightM > 0 ? '+' : ''}{t.heightM.toFixed(2)} m</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <p className="tide-unavail">Tide data unavailable — check back soon.</p>
        )}
      </section>

      {/* Multi-day Tide Forecast */}
      {tides.forecast && tides.forecast.length > 0 && (
        <section className="section">
          <h2 className="section-title">7-Day Tide Forecast</h2>
          <div className="tide-forecast-grid">
            {tides.forecast.map((day) => (
              <div key={day.date} className="tide-forecast-card">
                <div className="tide-fc-day">{day.dayLabel}</div>
                <div className="tide-fc-date">{day.date.slice(5).replace('-', '/')}</div>
                <div className="tide-fc-events">
                  {day.events.map((e, i) => {
                    const ft = e.heightFt ?? Math.round(e.heightM * 32.8084) / 10;
                    return (
                      <div key={i} className="tide-fc-row">
                        <span className={`tide-fc-arrow ${e.type}`}>
                          {e.type === 'high' ? '▲' : '▼'}
                        </span>
                        <span className="tide-fc-time">{e.time}</span>
                        <span className="tide-fc-ht">{ft > 0 ? '+' : ''}{ft.toFixed(1)} ft</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <p className="tide-source">
            Source: Open-Meteo Marine · {tides.isLive ? `Updated ${new Date(tides.fetchedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Mazatlan' })}` : 'Estimated — live data unavailable'}
          </p>
        </section>
      )}

      {/* Moon Phase */}
      <section className="section">
        <h2 className="section-title">Moon Phase</h2>
        <div className="moon-card">
          <span className="moon-emoji">{moon.emoji}</span>
          <div className="moon-info">
            <span className="moon-name">{moon.name}</span>
            <span className="moon-pct">{moon.illuminationPct}% illuminated</span>
          </div>
        </div>
      </section>

      {/* Water Safety */}
      <section className="section">
        <h2 className="section-title">Water Safety</h2>
        <div className="safety-grid">
          <div className="safety-card">
            <h3>Jellyfish &amp; Sea Urchins</h3>
            <p>Rinse with vinegar if available. Remove spines carefully. Soak in hot water (110–113°F) for 20–45 minutes.</p>
          </div>
          <div className="safety-card">
            <h3>Currents</h3>
            <p>The bay is generally calm, but north wind events can create choppy conditions. Always swim with a buddy.</p>
          </div>
          <div className="safety-card">
            <h3>Diving Emergencies</h3>
            <p>Nearest hyperbaric chamber is in La Paz (~200 km south). DAN emergency hotline: <strong>+1-919-684-9111</strong> (24/7).</p>
          </div>
        </div>
      </section>

      <style jsx>{`
        /* Hero */
        .water-hero { background: linear-gradient(135deg, var(--color-sea) 0%, #0d4f6e 100%); color: var(--color-white); padding: var(--sp-6) var(--sp-4); border-radius: var(--radius-lg); margin-bottom: var(--sp-6); }
        .water-hero h1 { font-size: 32px; font-weight: 700; margin: 0 0 var(--sp-1) 0; color: var(--color-white); }
        .hero-sub { font-size: 15px; opacity: 0.9; margin: 0; }

        /* Loading */
        .loading { text-align: center; padding: var(--sp-8); color: var(--color-desert); }

        /* Sections */
        .section { margin-bottom: var(--sp-8); }
        .section-title { font-size: 22px; font-weight: 700; color: var(--color-night); margin-bottom: var(--sp-4); }

        /* Conditions */
        .conditions-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--sp-3); }
        @media (min-width: 640px) { .conditions-grid { grid-template-columns: repeat(4, 1fr); } }
        .cond-card { background: var(--color-white); border-radius: var(--radius-md); padding: var(--sp-4); box-shadow: var(--shadow-card); display: flex; flex-direction: column; gap: var(--sp-1); align-items: center; text-align: center; }
        .cond-icon { font-size: 28px; margin-bottom: var(--sp-1); }
        .cond-label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; color: var(--color-desert); }
        .cond-value { font-family: var(--font-data); font-size: 28px; font-weight: 500; color: var(--color-night); }
        .cond-sub { font-size: 13px; color: var(--color-desert); }

        /* Tide header */
        .tide-header { display: flex; align-items: center; gap: var(--sp-3); margin-bottom: var(--sp-4); }
        .tide-header .section-title { margin-bottom: 0; }
        .live-badge { background: #22c55e; color: #fff; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 99px; letter-spacing: 0.03em; }
        .mock-badge { background: var(--color-sun); color: var(--color-night); font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 99px; }

        /* Tide bar chart */
        .tide-chart { display: flex; gap: var(--sp-4); justify-content: center; align-items: flex-end; margin-bottom: var(--sp-4); padding: var(--sp-4); background: var(--color-white); border-radius: var(--radius-md); box-shadow: var(--shadow-card); min-height: 160px; }
        .tide-bar-wrap { display: flex; flex-direction: column; align-items: center; gap: var(--sp-1); flex: 1; max-width: 100px; }
        .tide-bar-label-top { display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .tide-type-badge { font-size: 18px; }
        .tide-type-badge.high { color: var(--color-sea); }
        .tide-type-badge.low { color: var(--color-desert); }
        .tide-bar-ft { font-family: var(--font-data); font-size: 14px; font-weight: 600; color: var(--color-night); }
        .tide-bar-track { width: 40px; height: 100px; background: var(--color-sand); border-radius: var(--radius-sm); display: flex; align-items: flex-end; overflow: hidden; }
        .tide-bar-fill { width: 100%; border-radius: var(--radius-sm); transition: height 0.4s ease; }
        .tide-bar-fill.high { background: var(--color-sea); }
        .tide-bar-fill.low { background: var(--color-sea-light); }
        .tide-bar-time { font-size: 12px; color: var(--color-desert); text-align: center; }

        /* Tide table */
        .tide-card { background: var(--color-white); border-radius: var(--radius-md); box-shadow: var(--shadow-card); overflow: hidden; }
        .tide-row { display: grid; grid-template-columns: 90px 1fr auto; align-items: center; gap: var(--sp-3); padding: var(--sp-4); border-bottom: 1px solid var(--color-sand); }
        .tide-row:last-child { border-bottom: none; }
        .tide-badge { font-size: 14px; font-weight: 700; }
        .tide-badge--high { color: var(--color-sea); }
        .tide-badge--low { color: var(--color-desert); }
        .tide-time { font-family: var(--font-data); font-size: 18px; font-weight: 500; color: var(--color-night); }
        .tide-height { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
        .tide-ht-ft { font-family: var(--font-data); font-size: 16px; font-weight: 600; color: var(--color-night); }
        .tide-ht-m { font-family: var(--font-data); font-size: 12px; color: var(--color-desert); }

        .tide-unavail { color: var(--color-desert); font-style: italic; font-size: 14px; }

        /* 7-day forecast */
        .tide-forecast-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--sp-3); margin-bottom: var(--sp-3); }
        @media (min-width: 640px) { .tide-forecast-grid { grid-template-columns: repeat(6, 1fr); } }
        .tide-forecast-card { background: var(--color-white); border-radius: var(--radius-md); box-shadow: var(--shadow-card); padding: var(--sp-3); }
        .tide-fc-day { font-size: 13px; font-weight: 700; color: var(--color-sea); text-transform: uppercase; letter-spacing: 0.04em; }
        .tide-fc-date { font-size: 11px; color: var(--color-desert); margin-bottom: var(--sp-2); }
        .tide-fc-events { display: flex; flex-direction: column; gap: 4px; }
        .tide-fc-row { display: flex; align-items: center; gap: 4px; }
        .tide-fc-arrow { font-size: 11px; }
        .tide-fc-arrow.high { color: var(--color-sea); }
        .tide-fc-arrow.low { color: var(--color-desert); }
        .tide-fc-time { font-size: 11px; color: var(--color-night); flex: 1; }
        .tide-fc-ht { font-family: var(--font-data); font-size: 11px; font-weight: 600; color: var(--color-night); }
        .tide-source { font-size: 12px; color: var(--color-desert); font-style: italic; }

        /* Moon */
        .moon-card { background: var(--color-white); border-radius: var(--radius-md); box-shadow: var(--shadow-card); padding: var(--sp-5); display: flex; align-items: center; gap: var(--sp-4); }
        .moon-emoji { font-size: 56px; line-height: 1; }
        .moon-info { display: flex; flex-direction: column; gap: var(--sp-1); }
        .moon-name { font-size: 20px; font-weight: 600; color: var(--color-night); }
        .moon-pct { font-family: var(--font-data); font-size: 15px; color: var(--color-desert); }

        /* Safety */
        .safety-grid { display: grid; gap: var(--sp-3); }
        @media (min-width: 640px) { .safety-grid { grid-template-columns: repeat(3, 1fr); } }
        .safety-card { background: var(--color-sand-light, #F5F0E8); border-left: 4px solid var(--color-sea); padding: var(--sp-4); border-radius: var(--radius-sm); }
        .safety-card h3 { font-size: 15px; font-weight: 700; margin: 0 0 var(--sp-2) 0; color: var(--color-night); }
        .safety-card p { font-size: 14px; line-height: 1.6; color: var(--color-gray-dark, #555); margin: 0; }
        .safety-card strong { color: var(--color-night); }

        @media (min-width: 640px) {
          .water-hero { padding: var(--sp-8) var(--sp-6); }
          .water-hero h1 { font-size: 40px; }
          .section-title { font-size: 28px; }
        }
      `}</style>
    </div>
  );
}
