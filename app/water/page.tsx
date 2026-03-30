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

  return (
    <div className="page-container">
      <div className="water-hero">
        <h1>Water &amp; Marine</h1>
        <p className="hero-sub">Bahia Concepcion conditions</p>
      </div>

      <section className="section">
        <h2 className="section-title">Current Conditions</h2>
        <div className="conditions-grid">
          <div className="cond-card">
            <span className="cond-icon" aria-hidden="true">&#x1F321;</span>
            <span className="cond-label">Sea Temperature</span>
            <span className="cond-value">{c.seaTempC !== null ? `${c.seaTempC}&deg;C` : "&mdash;"}</span>
            {c.seaTempC === null && <span className="cond-sub">Source pending</span>}
          </div>
          <div className="cond-card">
            <span className="cond-icon" aria-hidden="true">&#x1F30A;</span>
            <span className="cond-label">Wave Height</span>
            <span className="cond-value">{c.waveHeightM}m</span>
            <span className="cond-sub">{c.waveDirectionLabel}</span>
          </div>
          <div className="cond-card">
            <span className="cond-icon" aria-hidden="true">&#x3030;&#xFE0F;</span>
            <span className="cond-label">Swell</span>
            <span className="cond-value">{c.swellHeightM}m</span>
            <span className="cond-sub">{c.swellDirectionLabel} &middot; {c.swellPeriodS}s period</span>
          </div>
          <div className="cond-card">
            <span className="cond-icon" aria-hidden="true">&#x1F30A;</span>
            <span className="cond-label">Wave Period</span>
            <span className="cond-value">{c.wavePeriodS}s</span>
            <span className="cond-sub">Dominant period</span>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Today&apos;s Tides</h2>
        <div className="tide-card">
          {tides.events.map((t, i) => (
            <div key={i} className="tide-row">
              <span className={`tide-badge tide-badge--${t.type}`}>
                {t.type === "high" ? "&#x25B2; High" : "&#x25BC; Low"}
              </span>
              <span className="tide-time">{t.time}</span>
              <span className="tide-height">{t.heightM}m</span>
            </div>
          ))}
        </div>
        <p className="tide-note">
          Tide data is approximate. WorldTides API integration pending for precise predictions.
        </p>
      </section>

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

      <section className="section">
        <h2 className="section-title">Water Safety</h2>
        <div className="safety-grid">
          <div className="safety-card">
            <h3>Jellyfish &amp; Sea Urchins</h3>
            <p>Rinse with vinegar if available. Remove spines carefully. Soak in hot water (110-113&deg;F) for 20-45 minutes.</p>
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
        .water-hero { background: linear-gradient(135deg, var(--color-sea) 0%, #0d4f6e 100%); color: var(--color-white); padding: var(--sp-6) var(--sp-4); border-radius: var(--radius-lg); margin-bottom: var(--sp-6); }
        .water-hero h1 { font-size: 32px; font-weight: 700; margin: 0 0 var(--sp-1) 0; color: var(--color-white); }
        .hero-sub { font-size: 15px; opacity: 0.9; margin: 0; }
        .loading { text-align: center; padding: var(--sp-8); color: var(--color-desert); }
        .section { margin-bottom: var(--sp-8); }
        .section-title { font-size: 22px; font-weight: 700; color: var(--color-night); margin-bottom: var(--sp-4); }
        .conditions-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--sp-3); }
        @media (min-width: 640px) { .conditions-grid { grid-template-columns: repeat(4, 1fr); } }
        .cond-card { background: var(--color-white); border-radius: var(--radius-md); padding: var(--sp-4); box-shadow: var(--shadow-card); display: flex; flex-direction: column; gap: var(--sp-1); align-items: center; text-align: center; }
        .cond-icon { font-size: 28px; margin-bottom: var(--sp-1); }
        .cond-label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; color: var(--color-desert); }
        .cond-value { font-family: var(--font-data); font-size: 28px; font-weight: 500; color: var(--color-night); }
        .cond-sub { font-size: 13px; color: var(--color-desert); }
        .tide-card { background: var(--color-white); border-radius: var(--radius-md); box-shadow: var(--shadow-card); overflow: hidden; }
        .tide-row { display: grid; grid-template-columns: 100px 1fr auto; align-items: center; gap: var(--sp-3); padding: var(--sp-4); border-bottom: 1px solid var(--color-sand); }
        .tide-row:last-child { border-bottom: none; }
        .tide-badge { font-size: 14px; font-weight: 600; }
        .tide-badge--high { color: var(--color-sea); }
        .tide-badge--low { color: var(--color-desert); }
        .tide-time { font-family: var(--font-data); font-size: 18px; font-weight: 500; color: var(--color-night); }
        .tide-height { font-family: var(--font-data); font-size: 16px; color: var(--color-desert); text-align: right; }
        .tide-note { font-size: 13px; color: var(--color-desert); margin-top: var(--sp-3); font-style: italic; }
        .moon-card { background: var(--color-white); border-radius: var(--radius-md); box-shadow: var(--shadow-card); padding: var(--sp-5); display: flex; align-items: center; gap: var(--sp-4); }
        .moon-emoji { font-size: 56px; line-height: 1; }
        .moon-info { display: flex; flex-direction: column; gap: var(--sp-1); }
        .moon-name { font-size: 20px; font-weight: 600; color: var(--color-night); }
        .moon-pct { font-family: var(--font-data); font-size: 15px; color: var(--color-desert); }
        .safety-grid { display: grid; gap: var(--sp-3); }
        @media (min-width: 640px) { .safety-grid { grid-template-columns: repeat(3, 1fr); } }
        .safety-card { background: var(--color-sand-light); border-left: 4px solid var(--color-sea); padding: var(--sp-4); border-radius: var(--radius-sm); }
        .safety-card h3 { font-size: 15px; font-weight: 700; margin: 0 0 var(--sp-2) 0; color: var(--color-night); }
        .safety-card p { font-size: 14px; line-height: 1.6; color: var(--color-gray-dark); margin: 0; }
        .safety-card strong { color: var(--color-night); }
        @media (min-width: 640px) { .water-hero { padding: var(--sp-8) var(--sp-6); } .water-hero h1 { font-size: 40px; } .section-title { font-size: 28px; } }
      `}</style>
    </div>
  );
}
