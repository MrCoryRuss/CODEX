'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface KM112Today {
  high_f: number; high_c: number;
  low_f: number;  low_c: number;
  desc: string; wind: string; water_temp_c: number;
}
interface KM112Tides { low1?: string; high1?: string; low2?: string; high2?: string; }
interface KM112Fishing { major?: string[]; minor?: string[]; rating?: string; }
interface KM112ForecastDay {
  day: string;
  high_f: number; high_c: number;
  low_f: number;  low_c: number;
  desc: string; wind: string;
  rain: boolean; clouds: boolean;
}
interface KM112Data {
  episode: { title: string; audioUrl: string; transcript: string; summary: string; generatedAt: string };
  weather: KM112Today;
  tides: KM112Tides;
  fishing: KM112Fishing;
  forecast: KM112ForecastDay[];
}

function formatDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });
}

function formatTime(s: number) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function DailyBriefingCard() {
  const [data, setData] = useState<KM112Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [scriptOpen, setScriptOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    fetch('/api/km112')
      .then(r => r.ok ? r.json() : null)
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play(); setPlaying(true); }
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  }

  const tides = data?.tides;
  const weather = data?.weather;
  const fishing = data?.fishing;

  return (
    <section className="card briefing-card" aria-label="KM112 daily briefing">
      {/* Header */}
      <div className="card-header">
        <span className="card-icon briefing-icon" aria-hidden="true">🎙️</span>
        <div className="briefing-title-block">
          <span className="card-title">KM112 · Morning Briefing</span>
          <span className="briefing-date">{formatDate()}</span>
        </div>
        <span className="on-air-badge">● On Air</span>
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading-state">
          <span className="spinner" />
          <span>Loading today&apos;s broadcast...</span>
        </div>
      )}

      {/* Player */}
      {!loading && data && (
        <>
          <audio
            ref={audioRef}
            src={data.episode.audioUrl}
            onTimeUpdate={() => { if (audioRef.current) setProgress(audioRef.current.currentTime); }}
            onLoadedMetadata={() => { if (audioRef.current) setDuration(audioRef.current.duration); }}
            onEnded={() => setPlaying(false)}
          />

          <div className="player">
            <button className="play-btn" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
              {playing ? '⏸' : '▶'}
            </button>
            <div className="track">
              <div className="progress-bar" onClick={seek} role="slider" aria-label="Seek">
                <div className="progress-fill" style={{ width: duration ? `${(progress / duration) * 100}%` : '0%' }} />
              </div>
              <div className="times">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          {/* Quick weather strip */}
          {weather && (
            <div className="weather-strip">
              <div className="ws-item">
                <span className="ws-label">High</span>
                <span className="ws-val">{weather.high_f}°F <span className="ws-alt">/ {weather.high_c}°C</span></span>
              </div>
              <div className="ws-div" />
              <div className="ws-item">
                <span className="ws-label">Low</span>
                <span className="ws-val">{weather.low_f}°F <span className="ws-alt">/ {weather.low_c}°C</span></span>
              </div>
              <div className="ws-div" />
              <div className="ws-item">
                <span className="ws-label">Wind</span>
                <span className="ws-val">{weather.wind}</span>
              </div>
              <div className="ws-div" />
              <div className="ws-item">
                <span className="ws-label">Water</span>
                <span className="ws-val">{weather.water_temp_c}°C <span className="ws-alt">/ {Math.round(weather.water_temp_c * 9/5 + 32)}°F</span></span>
              </div>
            </div>
          )}

          {/* Tides strip */}
          {tides && (
            <div className="tides-strip">
              {tides.low1  && <span className="tide-tag tide-low"><span className="tide-type">Low</span>{tides.low1}</span>}
              {tides.high1 && <span className="tide-tag tide-high"><span className="tide-type">High</span>{tides.high1}</span>}
              {tides.low2  && <span className="tide-tag tide-low"><span className="tide-type">Low</span>{tides.low2}</span>}
              {tides.high2 && <span className="tide-tag tide-high"><span className="tide-type">High</span>{tides.high2}</span>}
            </div>
          )}

          {/* Expandable: fishing + forecast */}
          <button className="expand-toggle" onClick={() => setDetailsOpen(o => !o)}>
            🎣 Fishing &amp; Forecast {detailsOpen ? '▲' : '▼'}
          </button>

          {detailsOpen && (
            <div className="details-panel">
              {fishing && (
                <div className="fish-section">
                  {fishing.major?.map((w, i) => (
                    <div key={i} className="fish-row"><span className="fish-dot fish-major" /><span className="fish-lbl">Major</span><span className="fish-time">{w}</span></div>
                  ))}
                  {fishing.minor?.map((w, i) => (
                    <div key={i} className="fish-row"><span className="fish-dot fish-minor" /><span className="fish-lbl">Minor</span><span className="fish-time">{w}</span></div>
                  ))}
                  {fishing.rating && <div className="fish-rating">{fishing.rating} fishing day</div>}
                </div>
              )}
              {data.forecast?.length > 0 && (
                <div className="forecast-mini">
                  {data.forecast.map(d => (
                    <div key={d.day} className="fc-mini-row">
                      <span className="fc-mini-day">{d.rain ? '🌧️' : d.clouds ? '⛅' : '☀️'} {d.day}</span>
                      <span className="fc-mini-temps">{d.high_f}°F/{d.high_c}°C → {d.low_f}°F/{d.low_c}°C</span>
                      <span className="fc-mini-wind">💨 {d.wind}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Script + full briefing link */}
          <div className="card-footer">
            <button className="script-toggle" onClick={() => setScriptOpen(o => !o)}>
              {scriptOpen ? 'Hide script ▲' : 'Read script ▼'}
            </button>
            <Link href="/daily-briefing" className="full-link">Full briefing →</Link>
          </div>

          {scriptOpen && (
            <pre className="script-text">{data.episode.transcript}</pre>
          )}
        </>
      )}

      {/* No data */}
      {!loading && !data && (
        <div className="empty-state">
          <p>Broadcast not yet available. Check back after 1&nbsp;AM.</p>
          <Link href="/daily-briefing" className="full-link-block">Go to Daily Briefing →</Link>
        </div>
      )}

      <style jsx>{`
        .briefing-card {
          background: linear-gradient(135deg, var(--color-sea) 0%, #0c4a6e 100%);
          color: #fff;
          border: none;
        }
        .briefing-icon { background: rgba(255,255,255,0.15) !important; color: #fff !important; }
        .briefing-title-block { display: flex; flex-direction: column; gap: 2px; flex: 1; }
        .card-title { color: rgba(255,255,255,0.7) !important; font-size: 12px !important; }
        .briefing-date { font-size: 15px; font-weight: 600; color: #fff; line-height: 1.2; }
        .on-air-badge {
          font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
          padding: 3px 10px; border-radius: 20px;
          background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.85);
        }
        /* Loading */
        .loading-state { display: flex; align-items: center; gap: var(--sp-3); padding: var(--sp-4) 0; color: rgba(255,255,255,0.7); font-size: 14px; }
        .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; flex-shrink: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        /* Player */
        .player { display: flex; align-items: center; gap: var(--sp-3); margin: var(--sp-4) 0 var(--sp-3); }
        .play-btn {
          width: 52px; height: 52px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.15);
          color: #fff; font-size: 20px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          transition: background 0.15s;
        }
        .play-btn:hover { background: rgba(255,255,255,0.28); }
        .track { flex: 1; min-width: 0; }
        .progress-bar { height: 6px; background: rgba(255,255,255,0.2); border-radius: 3px; cursor: pointer; overflow: hidden; }
        .progress-fill { height: 100%; background: #fff; border-radius: 3px; transition: width 0.1s linear; }
        .times { display: flex; justify-content: space-between; font-family: var(--font-data); font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 4px; }
        /* Weather strip */
        .weather-strip {
          display: flex; align-items: center; flex-wrap: wrap; gap: var(--sp-2);
          background: rgba(255,255,255,0.1); border-radius: var(--radius-md);
          padding: var(--sp-3) var(--sp-3); margin-bottom: var(--sp-3);
        }
        .ws-item { display: flex; flex-direction: column; flex: 1; min-width: 70px; }
        .ws-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.55); margin-bottom: 2px; }
        .ws-val { font-family: var(--font-data); font-size: 14px; font-weight: 600; color: #fff; white-space: nowrap; }
        .ws-alt { font-size: 12px; font-weight: 400; color: rgba(255,255,255,0.6); }
        .ws-div { width: 1px; height: 28px; background: rgba(255,255,255,0.15); flex-shrink: 0; }
        /* Tides */
        .tides-strip { display: flex; flex-wrap: wrap; gap: var(--sp-2); margin-bottom: var(--sp-3); }
        .tide-tag { display: flex; flex-direction: column; padding: 6px 12px; border-radius: var(--radius-sm); font-family: var(--font-data); font-size: 14px; font-weight: 600; }
        .tide-type { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 1px; font-family: var(--font-body); }
        .tide-low { background: rgba(255,255,255,0.12); color: #fff; }
        .tide-low .tide-type { color: rgba(255,255,255,0.55); }
        .tide-high { background: rgba(255,255,255,0.25); color: #fff; }
        .tide-high .tide-type { color: rgba(255,255,255,0.75); }
        /* Expand */
        .expand-toggle {
          width: 100%; text-align: left; background: none; border: none;
          color: rgba(255,255,255,0.65); font-family: var(--font-body);
          font-size: 13px; font-weight: 600; cursor: pointer; padding: var(--sp-2) 0;
          border-top: 1px solid rgba(255,255,255,0.12);
        }
        .expand-toggle:hover { color: #fff; }
        .details-panel { padding: var(--sp-3) 0; border-top: 1px solid rgba(255,255,255,0.1); }
        /* Fishing */
        .fish-section { margin-bottom: var(--sp-3); display: flex; flex-direction: column; gap: 6px; }
        .fish-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: rgba(255,255,255,0.85); }
        .fish-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .fish-major { background: #7dd3fc; }
        .fish-minor { background: #fde68a; }
        .fish-lbl { font-weight: 600; min-width: 44px; font-size: 12px; color: rgba(255,255,255,0.65); }
        .fish-time { font-family: var(--font-data); }
        .fish-rating { font-size: 12px; color: rgba(255,255,255,0.55); padding-top: 4px; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 4px; }
        /* Forecast mini */
        .forecast-mini { display: flex; flex-direction: column; gap: 6px; }
        .fc-mini-row { display: flex; align-items: center; gap: var(--sp-3); font-size: 13px; color: rgba(255,255,255,0.85); flex-wrap: wrap; }
        .fc-mini-day { font-weight: 700; min-width: 90px; }
        .fc-mini-temps { font-family: var(--font-data); color: rgba(255,255,255,0.8); }
        .fc-mini-wind { font-size: 12px; color: rgba(255,255,255,0.55); }
        /* Footer */
        .card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: var(--sp-3); padding-top: var(--sp-3); border-top: 1px solid rgba(255,255,255,0.12); }
        .script-toggle { background: none; border: none; color: rgba(255,255,255,0.55); font-family: var(--font-body); font-size: 13px; font-weight: 500; cursor: pointer; padding: 0; }
        .script-toggle:hover { color: #fff; }
        .full-link { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.8); text-decoration: none; }
        .full-link:hover { color: #fff; }
        .script-text { font-family: var(--font-body); font-size: 14px; line-height: 1.7; color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.08); border-radius: var(--radius-sm); padding: var(--sp-3); white-space: pre-wrap; margin-top: var(--sp-3); }
        /* Empty */
        .empty-state { padding: var(--sp-4) 0; text-align: center; color: rgba(255,255,255,0.7); font-size: 14px; }
        .full-link-block { display: inline-block; margin-top: var(--sp-3); font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.85); text-decoration: none; }
        .full-link-block:hover { color: #fff; }
      `}</style>
    </section>
  );
}
