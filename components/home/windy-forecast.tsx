"use client";

import { useEffect, useRef, useState } from "react";

const SPOT_ID = "8461035";
const APP_ID = "0997810fb463c653f2379ae7aa2dcc3e";
const SCRIPT_SRC = "https://windy.app/widgets-code/forecast/windy_forecast_async.js?v184";

export default function WindyForecast() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      setLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);

    return () => {};
  }, []);

  return (
    <section className="card windy-forecast" aria-label="Windy.app forecast">
      <div className="card-header">
        <span className="card-icon card-icon--sea" aria-hidden="true">🌊</span>
        <span className="card-title">Wind & Weather Forecast</span>
        <span className="card-badge">Windy Pro</span>
      </div>

      <div className="widget-container" ref={containerRef}>
        {!loaded && (
          <div className="widget-loading">
            <div className="widget-spinner" />
            <p>Loading forecast...</p>
          </div>
        )}
        <div
          dangerouslySetInnerHTML={{
            __html: `<div data-windywidget="forecast" data-thememode="white" data-spotid="${SPOT_ID}" data-appid="${APP_ID}"></div>`,
          }}
        />
      </div>

      <style jsx>{`
        .windy-forecast { padding-bottom: var(--sp-3); }
        .card-badge { margin-left: auto; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-sea); background: var(--color-sea-faint, rgba(0, 102, 255, 0.08)); padding: 2px 8px; border-radius: var(--radius-sm); }
        .widget-container { position: relative; min-height: 400px; border-radius: var(--radius-sm); overflow: hidden; }
        .widget-loading { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--sp-2); background: var(--color-sand, #f0f0f0); z-index: 1; color: var(--color-desert, #666); font-size: 14px; }
        .widget-spinner { width: 28px; height: 28px; border: 3px solid var(--color-sea-light, #ccc); border-top-color: var(--color-sea, #0066ff); border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}
