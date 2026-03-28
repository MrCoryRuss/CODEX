"use client";

import { useState, useCallback } from "react";

// ── Windy embed config ──────────────────────────────────────

export interface WindyConfig {
  lat: number;
  lon: number;
  zoom: number;
  overlay: WindyOverlay;
  metricWind: "kt" | "m/s" | "km/h" | "mph";
  metricTemp: "°C" | "°F";
}

type WindyOverlay = "wind" | "rain" | "clouds" | "temp";

const OVERLAY_OPTIONS: { key: WindyOverlay; label: string; icon: string }[] = [
  { key: "wind",   label: "Wind",   icon: "💨" },
  { key: "rain",   label: "Rain",   icon: "🌧" },
  { key: "clouds", label: "Clouds", icon: "☁️" },
  { key: "temp",   label: "Temp",   icon: "🌡" },
];

function buildWindyUrl(config: WindyConfig, overlay?: WindyOverlay): string {
  const o = overlay ?? config.overlay;
  const params = new URLSearchParams({
    type: "map",
    location: "coordinates",
    metricRain: "mm",
    metricTemp: config.metricTemp,
    metricWind: config.metricWind,
    zoom: String(config.zoom),
    overlay: o,
    product: "ecmwf",
    level: "surface",
    lat: String(config.lat),
    lon: String(config.lon),
    // Keep the embed compact: hide some Windy chrome
    detailLat: String(config.lat),
    detailLon: String(config.lon),
    marker: "true",
    message: "true",
  });
  return `https://embed.windy.com/embed.html?${params}`;
}

// ── Default config for Posada Concepcion ────────────────────

export const POSADA_WINDY: WindyConfig = {
  lat: 26.55,
  lon: -111.78,
  zoom: 8,
  overlay: "wind",
  metricWind: "kt",
  metricTemp: "°C",
};

// ── Component ───────────────────────────────────────────────

interface Props {
  config?: WindyConfig;
}

export default function WeatherMap({ config = POSADA_WINDY }: Props) {
  const [activeOverlay, setActiveOverlay] = useState<WindyOverlay>(config.overlay);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");

  const embedUrl = buildWindyUrl(config, activeOverlay);

  const handleLoad = useCallback(() => setLoadState("loaded"), []);
  const handleError = useCallback(() => setLoadState("error"), []);

  const switchOverlay = useCallback((overlay: WindyOverlay) => {
    if (overlay === activeOverlay) return;
    setLoadState("loading");
    setActiveOverlay(overlay);
  }, [activeOverlay]);

  return (
    <section className="card weather-map" aria-label="Live weather map">
      <div className="card-header">
        <span className="card-icon card-icon--sea" aria-hidden="true">📡</span>
        <span className="card-title">Live Radar</span>
      </div>

      {/* Layer toggle strip */}
      <div className="layer-strip" role="tablist" aria-label="Map layer selection">
        {OVERLAY_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            role="tab"
            aria-selected={activeOverlay === opt.key}
            className={`layer-btn ${activeOverlay === opt.key ? "layer-btn--active" : ""}`}
            onClick={() => switchOverlay(opt.key)}
          >
            <span aria-hidden="true">{opt.icon}</span>
            <span className="layer-label">{opt.label}</span>
          </button>
        ))}
      </div>

      {/* Map frame */}
      <div className="map-frame">
        {/* Loading overlay */}
        {loadState === "loading" && (
          <div className="map-overlay">
            <div className="map-spinner" />
            <p className="map-overlay-text">Loading map...</p>
          </div>
        )}

        {/* Error fallback */}
        {loadState === "error" && (
          <div className="map-overlay map-overlay--error">
            <span className="map-overlay-icon" aria-hidden="true">📡</span>
            <p className="map-overlay-text">Map unavailable right now</p>
            <a
              href={`https://www.windy.com/${config.lat}/${config.lon}?${activeOverlay}`}
              target="_blank"
              rel="noopener noreferrer"
              className="map-fallback-link"
            >
              Open Windy.com directly →
            </a>
          </div>
        )}

        {/* The iframe always renders so onLoad/onError fire */}
        <iframe
          key={activeOverlay}
          src={embedUrl}
          title={`Windy weather map showing ${activeOverlay} for Bahía Concepción`}
          className={`map-iframe ${loadState === "loaded" ? "map-iframe--visible" : ""}`}
          loading="lazy"
          allow="geolocation"
          sandbox="allow-scripts allow-same-origin allow-popups"
          onLoad={handleLoad}
          onError={handleError}
        />
      </div>

      <div className="map-footer">
        <span className="caption">Powered by Windy.com</span>
        <a href="/weather" className="map-detail-link">Full weather page →</a>
      </div>

      <style jsx>{`
        .weather-map {
          padding-bottom: var(--sp-3);
        }

        /* Layer toggle strip */
        .layer-strip {
          display: flex;
          gap: var(--sp-1);
          margin-bottom: var(--sp-3);
          overflow-x: auto;
          scrollbar-width: none;
        }

        .layer-strip::-webkit-scrollbar {
          display: none;
        }

        .layer-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: var(--sp-1) var(--sp-3);
          border: 1px solid var(--color-sand);
          border-radius: var(--radius-lg);
          background: var(--color-sand);
          color: var(--color-desert);
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          min-height: 36px;
          transition: background 0.12s ease, color 0.12s ease, border-color 0.12s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .layer-btn:hover {
          border-color: var(--color-sea-light);
          color: var(--color-sea);
        }

        .layer-btn--active {
          background: var(--color-sea-faint);
          border-color: var(--color-sea);
          color: var(--color-sea);
          font-weight: 600;
        }

        .layer-label {
          line-height: 1;
        }

        /* Map frame */
        .map-frame {
          position: relative;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background: var(--color-sand);
          margin-bottom: var(--sp-3);

          /* Responsive aspect ratio:
             taller on mobile for usability,
             wider on desktop for context */
          aspect-ratio: 4 / 3;
        }

        @media (min-width: 640px) {
          .map-frame {
            aspect-ratio: 16 / 9;
          }
        }

        /* Iframe */
        .map-iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .map-iframe--visible {
          opacity: 1;
        }

        /* Loading / error overlays */
        .map-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--sp-2);
          z-index: 2;
          text-align: center;
          padding: var(--sp-4);
          background:
            linear-gradient(135deg, var(--color-sea-faint) 0%, var(--color-sand) 50%, var(--color-sun-light) 100%);
        }

        .map-overlay--error {
          background: var(--color-sand);
        }

        .map-overlay-icon {
          font-size: 32px;
          opacity: 0.5;
        }

        .map-overlay-text {
          font-size: 15px;
          font-weight: 500;
          color: var(--color-night);
        }

        .map-spinner {
          width: 28px;
          height: 28px;
          border: 3px solid var(--color-sea-light);
          border-top-color: var(--color-sea);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .map-fallback-link {
          font-size: 14px;
          font-weight: 500;
          color: var(--color-sea);
          text-decoration: none;
          margin-top: var(--sp-1);
        }

        .map-fallback-link:hover {
          text-decoration: underline;
        }

        /* Footer */
        .map-footer {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 0 var(--sp-1);
        }

        .map-detail-link {
          font-size: 14px;
          font-weight: 500;
          color: var(--color-sea);
          text-decoration: none;
          white-space: nowrap;
        }

        .map-detail-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </section>
  );
}
