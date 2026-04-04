"use client";

import { useState } from "react";

const SPOT_ID = "8461035";
const APP_ID = "351262c50918c72dba6600c2da72c007";

// The map widget needs explicit pixel dimensions on the target div and full
// html/body height — without this the canvas has nothing to size against.
// overflow:hidden on the container clips the internal iframe; removed.
// sandbox must allow scripts + same-origin for the widget JS to run.
const widgetHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%;background:#000}
.ww-map{width:100%;height:100%}
</style></head>
<body>
<div
  class="ww-map"
  data-windywidget="map"
  data-spotid="${SPOT_ID}"
  data-appid="${APP_ID}"
  data-spots="true"
  style="width:100%;height:100%">
</div>
<script async="true" data-cfasync="false" type="text/javascript" src="https://windy.app/widget3/windy_map_async.js"><\/script>
</body></html>`;

export default function WindyAppMap() {
  const [loaded, setLoaded] = useState(false);
  return (
    <section className="card windy-app-map" aria-label="Windy.app map">
      <div className="card-header">
        <span className="card-icon card-icon--sea" aria-hidden="true">📡</span>
        <span className="card-title">Live Wind Map</span>
        <span className="card-badge">Windy Pro</span>
      </div>
      <div className="widget-container">
        {!loaded && (
          <div className="widget-loading">
            <div className="widget-spinner" />
            <p>Loading map...</p>
          </div>
        )}
        <iframe
          srcDoc={widgetHtml}
          title="Windy.app live wind map"
          className={`widget-iframe ${loaded ? "widget-iframe--visible" : ""}`}
          onLoad={() => setLoaded(true)}
          allow="geolocation; webgl *"
          sandbox="allow-scripts allow-same-origin allow-popups"
          loading="lazy"
        />
      </div>
      <div className="map-footer">
        <span className="caption">Powered by Windy.app</span>
        <a href="/weather" className="map-detail-link">Full weather page →</a>
      </div>
      <style jsx>{`
        .windy-app-map { padding-bottom: var(--sp-3); }
        .card-badge { margin-left: auto; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-sea); background: var(--color-sea-faint, rgba(0, 102, 255, 0.08)); padding: 2px 8px; border-radius: var(--radius-sm); }
        .widget-container {
          position: relative;
          height: 650px;
          border-radius: var(--radius-sm);
          /* overflow:hidden removed — it clips the map canvas */
        }
        .widget-iframe { width: 100%; height: 100%; border: none; opacity: 0; transition: opacity 0.3s ease; display: block; }
        .widget-iframe--visible { opacity: 1; }
        .widget-loading { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--sp-2); background: var(--color-sand, #f0f0f0); z-index: 1; color: var(--color-desert, #666); font-size: 14px; }
        .widget-spinner { width: 28px; height: 28px; border: 3px solid var(--color-sea-light, #ccc); border-top-color: var(--color-sea, #0066ff); border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .map-footer { display: flex; justify-content: space-between; align-items: baseline; padding: var(--sp-2) var(--sp-1) 0; }
        .map-detail-link { font-size: 14px; font-weight: 500; color: var(--color-sea); text-decoration: none; white-space: nowrap; }
        .map-detail-link:hover { text-decoration: underline; }
      `}</style>
    </section>
  );
}
