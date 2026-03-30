'use client';

import { useState, useEffect } from 'react';
import { WeatherMap } from "@/components/home";
import { fetchDailyForecast, fetchWindForecast, fetchCurrentConditions } from "@/lib/weather";
import type { CurrentConditions, DailyForecast, WindForecast } from "@/types/weather";

export default function WeatherPage() {
  const [current, setCurrent] = useState<CurrentConditions | null>(null);
  const [forecast, setForecast] = useState<DailyForecast | null>(null);
  const [wind, setWind] = useState<WindForecast | null>(null);

  useEffect(() => {
    Promise.all([
      fetchCurrentConditions(),
      fetchDailyForecast(),
      fetchWindForecast(),
    ]).then(([c, f, w]) => {
      setCurrent(c);
      setForecast(f);
      setWind(w);
    });
  }, []);

  return (
    <div className="page-container">
      <div className="weather-hero">
        <h1>Weather & Wind</h1>
        <p className="hero-sub">Posada Concepcion, Bahia Concepcion</p>
      </div>

      {current && (
        <section className="section">
          <h2 className="section-title">Current Conditions</h2>
          <div className="conditions-grid">
            <div className="cond-card">
              <span className="cond-label">Temperature</span>
              <span className="cond-value">{current.tempC}&deg;C</span>
              <span className="cond-sub">Feels like {current.feelsLikeC}&deg;C</span>
            </div>
            <div className="cond-card">
              <span className="cond-label">Wind</span>
              <span className="cond-value">{current.windSpeedKts} kts</span>
              <span className="cond-sub">{current.windDirectionLabel} &middot; Gusts {current.windGustsKts} kts</span>
            </div>
            <div className="cond-card">
              <span className="cond-label">UV Index</span>
              <span className="cond-value">{current.uvIndex}</span>
              <span className="cond-sub">{current.uvIndex >= 8 ? "Very High" : current.uvIndex >= 6 ? "High" : current.uvIndex >= 3 ? "Moderate" : "Low"}</span>
            </div>
            <div className="cond-card">
              <span className="cond-label">Humidity</span>
              <span className="cond-value">{current.humidity}%</span>
              <span className="cond-sub">Pressure {current.pressureHpa} hPa</span>
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <h2 className="section-title">Live Wind Map</h2>
        <WeatherMap />
      </section>

      {forecast && (
        <section className="section">
          <h2 className="section-title">7-Day Forecast</h2>
          <div className="forecast-table">
            {forecast.days.map((d) => (
              <div key={d.date} className="fc-row">
                <div className="fc-day-col">
                  <span className="fc-day">{d.dayLabel}</span>
                  <span className="fc-date">{d.dateLabel}</span>
                </div>
                <span className="fc-icon">{d.weatherIcon}</span>
                <div className="fc-desc-col">
                  <span className="fc-desc">{d.weatherLabel}</span>
                </div>
                <div className="fc-temp-col">
                  <span className="fc-high">{d.highC}&deg;</span>
                  <span className="fc-low">{d.lowC}&deg;</span>
                </div>
                <div className="fc-detail-col">
                  <span className="fc-wind">{d.windMaxKts}kt {d.windDominantDir}</span>
                  {d.precipMm > 0 && <span className="fc-rain">{d.precipMm}mm</span>}
                  <span className="fc-uv">UV {d.uvMax}</span>
                </div>
                <div className="fc-sun-col">
                  <span className="fc-sunrise">{d.sunrise}</span>
                  <span className="fc-sunset">{d.sunset}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {wind && (
        <section className="section">
          <h2 className="section-title">48-Hour Wind Forecast</h2>
          <div className="wind-scroll">
            <div className="wind-timeline">
              {wind.hours.filter((_, i) => i % 3 === 0).map((h) => {
                const d = new Date(h.time);
                const hour = d.getHours();
                const label = hour === 0
                  ? d.toLocaleDateString("en-US", { weekday: "short" })
                  : `${hour % 12 || 12}${hour < 12 ? "a" : "p"}`;
                const barHeight = Math.min(100, (h.speedKts / 30) * 100);
                const gustHeight = Math.min(100, (h.gustKts / 30) * 100);
                return (
                  <div key={h.time} className="wind-col">
                    <div className="wind-bars">
                      <div className="wind-gust-bar" style={{ height: `${gustHeight}%` }} title={`Gust: ${h.gustKts}kt`} />
                      <div className="wind-speed-bar" style={{ height: `${barHeight}%` }} title={`Wind: ${h.speedKts}kt`} />
                    </div>
                    <span className="wind-val">{h.speedKts}</span>
                    <span className="wind-dir">{h.directionLabel}</span>
                    <span className="wind-time">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="wind-legend">
            <span className="legend-item"><span className="legend-swatch legend-swatch--speed" /> Wind</span>
            <span className="legend-item"><span className="legend-swatch legend-swatch--gust" /> Gusts</span>
            <span className="legend-unit">knots</span>
          </div>
        </section>
      )}

      <style jsx>{`
        .weather-hero { background: linear-gradient(135deg, var(--color-sea) 0%, var(--color-sea-light) 100%); color: var(--color-white); padding: var(--sp-6) var(--sp-4); border-radius: var(--radius-lg); margin-bottom: var(--sp-6); }
        .weather-hero h1 { font-size: 32px; font-weight: 700; margin: 0 0 var(--sp-1) 0; color: var(--color-white); }
        .hero-sub { font-size: 15px; opacity: 0.9; margin: 0; }
        .section { margin-bottom: var(--sp-8); }
        .section-title { font-size: 22px; font-weight: 700; color: var(--color-night); margin-bottom: var(--sp-4); }
        .conditions-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--sp-3); }
        @media (min-width: 640px) { .conditions-grid { grid-template-columns: repeat(4, 1fr); } }
        .cond-card { background: var(--color-white); border-radius: var(--radius-md); padding: var(--sp-4); box-shadow: var(--shadow-card); display: flex; flex-direction: column; gap: var(--sp-1); }
        .cond-label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; color: var(--color-desert); }
        .cond-value { font-family: var(--font-data); font-size: 28px; font-weight: 500; color: var(--color-night); }
        .cond-sub { font-size: 13px; color: var(--color-desert); }
        .forecast-table { background: var(--color-white); border-radius: var(--radius-md); box-shadow: var(--shadow-card); overflow: hidden; }
        .fc-row { display: grid; grid-template-columns: 70px 32px 1fr 60px auto 60px; align-items: center; gap: var(--sp-2); padding: var(--sp-3) var(--sp-4); border-bottom: 1px solid var(--color-sand); }
        .fc-row:last-child { border-bottom: none; }
        .fc-day-col { display: flex; flex-direction: column; }
        .fc-day { font-size: 15px; font-weight: 600; color: var(--color-night); }
        .fc-date { font-size: 12px; color: var(--color-desert); }
        .fc-icon { font-size: 22px; text-align: center; }
        .fc-desc-col { min-width: 0; }
        .fc-desc { font-size: 14px; color: var(--color-night); }
        .fc-temp-col { display: flex; gap: var(--sp-2); font-family: var(--font-data); font-size: 15px; font-weight: 500; }
        .fc-high { color: var(--color-night); }
        .fc-low { color: var(--color-desert); }
        .fc-detail-col { display: flex; flex-direction: column; gap: 2px; font-size: 12px; color: var(--color-desert); }
        .fc-sun-col { display: flex; flex-direction: column; gap: 2px; font-family: var(--font-data); font-size: 12px; color: var(--color-desert); text-align: right; }
        .wind-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: var(--sp-2); }
        .wind-timeline { display: flex; gap: 2px; min-width: max-content; }
        .wind-col { display: flex; flex-direction: column; align-items: center; width: 48px; flex-shrink: 0; }
        .wind-bars { position: relative; width: 24px; height: 80px; display: flex; flex-direction: column; justify-content: flex-end; }
        .wind-speed-bar { background: var(--color-sea); border-radius: 3px 3px 0 0; min-height: 2px; position: absolute; bottom: 0; left: 2px; right: 2px; }
        .wind-gust-bar { background: var(--color-sea-light); border-radius: 3px 3px 0 0; min-height: 2px; position: absolute; bottom: 0; left: 0; right: 0; }
        .wind-val { font-family: var(--font-data); font-size: 12px; font-weight: 500; color: var(--color-night); margin-top: var(--sp-1); }
        .wind-dir { font-size: 10px; color: var(--color-desert); }
        .wind-time { font-size: 11px; font-weight: 600; color: var(--color-desert); margin-top: 2px; }
        .wind-legend { display: flex; align-items: center; gap: var(--sp-4); margin-top: var(--sp-3); font-size: 13px; color: var(--color-desert); }
        .legend-item { display: flex; align-items: center; gap: var(--sp-1); }
        .legend-swatch { width: 12px; height: 12px; border-radius: 2px; }
        .legend-swatch--speed { background: var(--color-sea); }
        .legend-swatch--gust { background: var(--color-sea-light); }
        .legend-unit { margin-left: auto; font-family: var(--font-data); font-size: 12px; }
        @media (max-width: 768px) { .fc-row { grid-template-columns: 60px 28px 1fr 50px; } .fc-detail-col, .fc-sun-col { display: none; } }
        @media (min-width: 640px) { .weather-hero { padding: var(--sp-8) var(--sp-6); } .weather-hero h1 { font-size: 40px; } .section-title { font-size: 28px; } }
      `}</style>
    </div>
  );
}
