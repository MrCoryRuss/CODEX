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
      {/* Station header */}
      <div className="station-header">
        <div className="station-label">Morning Briefing</div>
        <div className="station-id">KM · 112</div>
        <div className="station-meta">
          <span className="briefing-date">{formatDate()}</span>
          <span className="on-air-badge"><span className="on-air-dot" />ON AIR</span>
        </div>
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

          {/* Quick weather strip — CSS grid, no overflow */}
          {weather && (
            <div className="weather-strip">
              <div className="ws-item">
                <span className="ws-label">High</span>
                <span className="ws-val">{weather.high_f}°<span className="ws-unit">F</span></span>
                <span className="ws-alt">{weather.high_c}°C</span>
              </div>
              <div className="ws-item">
                <span className="ws-label">Low</span>
                <span className="ws-val">{weather.low_f}°<span className="ws-unit">F</span></span>
                <span className="ws-alt">{weather.low_c}°C</span>
              </div>
              <div className="ws-item">
                <span className="ws-label">Wind</span>
                <span className="ws-val ws-wind">{weather.wind}</span>
                <span className="ws-alt">&nbsp;</span>
              </div>
              <div className="ws-item">
                <span className="ws-label">Water</span>
                <span className="ws-val">{weather.water_temp_c}°<span className="ws-unit">C</span></span>
                <span className="ws-alt">{Math.round(weather.water_temp_c * 9/5 + 32)}°F</span>
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
                      <span className="fc-mini-temps">{d.high_f}°/{d.low_f}°F</span>
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
        /* ── Card shell ── */
        .briefing-card {
          background: linear-gradient(140deg, #2C1810 0%, #0F3D52 100%);
          color: #fff;
          border: none;
          overflow: hidden;
        }

        /* ── Station header ── */
        .station-header {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
          margin-bottom: var(--sp-4);
          padding-bottom: var(--sp-4);
          border-bottom: 1px solid rgba(212,196,160,0.15);
        }
        .station-label {
          font-family: var(--font-body);
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: rgba(212,136,42,0.7);
        }
        .station-id {
          font-family: var(--font-display);
          font-size: 38px;
          font-weight: 900;
          color: #D4882A;
          line-height: 1;
          letter-spacing: 0.04em;
          text-shadow: 0 0 24px rgba(212,136,42,0.35);
        }
        .station-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin-top: 4px;
        }
        .briefing-date {
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.55);
        }
        .on-air-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: #E53E3E;
          padding: 3px 9px;
          border-radius: 20px;
          background: rgba(229,62,62,0.12);
          border: 1px solid rgba(229,62,62,0.3);
        }
        .on-air-dot {
          display: inline-block;
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #E53E3E;
          animation: pulse-red 1.4s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes pulse-red { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.85)} }

        /* ── Loading ── */
        .loading-state { display: flex; align-items: center; gap: var(--sp-3); padding: var(--sp-4) 0; color: rgba(255,255,255,0.6); font-size: 14px; }
        .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.2); border-top-color: #D4882A; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; flex-shrink: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Player ── */
        .player { display: flex; align-items: center; gap: var(--sp-3); margin: 0 0 var(--sp-4); }
        .play-btn {
          width: 52px; height: 52px; border-radius: 50%;
          border: 2px solid rgba(212,136,42,0.5);
          background: rgba(212,136,42,0.2);
          color: #D4882A; font-size: 20px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          transition: background 0.15s, border-color 0.15s;
        }
        .play-btn:hover { background: rgba(212,136,42,0.35); border-color: #D4882A; }
        .track { flex: 1; min-width: 0; }
        .progress-bar { height: 5px; background: rgba(212,136,42,0.2); border-radius: 3px; cursor: pointer; overflow: hidden; }
        .progress-fill { height: 100%; background: #D4882A; border-radius: 3px; transition: width 0.1s linear; }
        .times { display: flex; justify-content: space-between; font-family: var(--font-data); font-size: 12px; color: rgba(212,136,42,0.6); margin-top: 4px; }

        /* ── Weather strip — CSS grid, no overflow ── */
        .weather-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          background: rgba(255,255,255,0.06);
          border-radius: var(--radius-md);
          margin-bottom: var(--sp-3);
          overflow: hidden;
        }
        .ws-item {
          display: flex; flex-direction: column;
          padding: var(--sp-3) var(--sp-2);
          border-right: 1px solid rgba(255,255,255,0.08);
          min-width: 0;
        }
        .ws-item:last-child { border-right: none; }
        .ws-label {
          font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em;
          color: rgba(212,136,42,0.6); margin-bottom: 3px; font-weight: 700;
        }
        .ws-val {
          font-family: var(--font-data); font-size: 15px; font-weight: 700;
          color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .ws-wind { font-size: 11px; font-weight: 600; }
        .ws-unit { font-size: 11px; font-weight: 400; color: rgba(255,255,255,0.5); }
        .ws-alt { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 1px; }

        /* ── Tides ── */
        .tides-strip { display: flex; flex-wrap: wrap; gap: var(--sp-2); margin-bottom: var(--sp-3); }
        .tide-tag {
          display: flex; flex-direction: column;
          padding: 6px 12px; border-radius: var(--radius-sm);
          font-family: var(--font-data); font-size: 13px; font-weight: 700;
        }
        .tide-type { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 2px; font-family: var(--font-body); }
        .tide-low { background: rgba(212,136,42,0.12); color: rgba(255,255,255,0.85); border: 1px solid rgba(212,136,42,0.2); }
        .tide-low .tide-type { color: rgba(212,136,42,0.65); }
        .tide-high { background: rgba(212,136,42,0.28); color: #fff; border: 1px solid rgba(212,136,42,0.4); }
        .tide-high .tide-type { color: #D4882A; }

        /* ── Expand toggle ── */
        .expand-toggle {
          width: 100%; text-align: left; background: none; border: none;
          color: rgba(212,136,42,0.65); font-family: var(--font-body);
          font-size: 13px; font-weight: 600; cursor: pointer; padding: var(--sp-2) 0;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .expand-toggle:hover { color: #D4882A; }

        /* ── Details panel ── */
        .details-panel { padding: var(--sp-3) 0; border-top: 1px solid rgba(255,255,255,0.08); }
        .fish-section { margin-bottom: var(--sp-3); display: flex; flex-direction: column; gap: 6px; }
        .fish-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: rgba(255,255,255,0.85); }
        .fish-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .fish-major { background: #D4882A; }
        .fish-minor { background: rgba(212,136,42,0.5); }
        .fish-lbl { font-weight: 600; min-width: 44px; font-size: 12px; color: rgba(255,255,255,0.5); }
        .fish-time { font-family: var(--font-data); }
        .fish-rating { font-size: 12px; color: rgba(212,136,42,0.7); padding-top: 4px; border-top: 1px solid rgba(255,255,255,0.08); margin-top: 4px; font-weight: 600; }
        .forecast-mini { display: flex; flex-direction: column; gap: 6px; }
        .fc-mini-row { display: flex; align-items: center; gap: var(--sp-3); font-size: 13px; color: rgba(255,255,255,0.85); flex-wrap: wrap; }
        .fc-mini-day { font-weight: 700; min-width: 90px; }
        .fc-mini-temps { font-family: var(--font-data); color: rgba(255,255,255,0.75); }
        .fc-mini-wind { font-size: 12px; color: rgba(255,255,255,0.45); }

        /* ── Footer ── */
        .card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: var(--sp-3); padding-top: var(--sp-3); border-top: 1px solid rgba(255,255,255,0.1); }
        .script-toggle { background: none; border: none; color: rgba(255,255,255,0.4); font-family: var(--font-body); font-size: 13px; font-weight: 500; cursor: pointer; padding: 0; }
        .script-toggle:hover { color: rgba(255,255,255,0.75); }
        .full-link { font-size: 13px; font-weight: 700; color: #D4882A; text-decoration: none; }
        .full-link:hover { color: #F5A84A; text-decoration: none; }
        .script-text { font-family: var(--font-body); font-size: 14px; line-height: 1.7; color: rgba(255,255,255,0.75); background: rgba(255,255,255,0.06); border-radius: var(--radius-sm); padding: var(--sp-3); white-space: pre-wrap; margin-top: var(--sp-3); }

        /* ── Empty ── */
        .empty-state { padding: var(--sp-4) 0; text-align: center; color: rgba(255,255,255,0.6); font-size: 14px; }
        .full-link-block { display: inline-block; margin-top: var(--sp-3); font-size: 14px; font-weight: 600; color: #D4882A; text-decoration: none; }
        .full-link-block:hover { color: #F5A84A; }
      `}</style>
    </section>
  );
}
