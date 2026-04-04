"use client";

import { useState, useRef, useEffect } from "react";

interface BriefingState {
  audioUrl: string;
  script: string;
  generatedAt: string;
  isMock: boolean;
}

const STORAGE_KEY = "posada_briefing_v1";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });
}

export default function DailyBriefingCard() {
  const [briefing, setBriefing] = useState<BriefingState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [scriptOpen, setScriptOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === todayKey()) {
          setBriefing(parsed.briefing);
        }
      }
    } catch {}
  }, []);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-podcast", { method: "POST" });
      if (!res.ok) throw new Error("Generation failed");
      const data: BriefingState = await res.json();
      setBriefing(data);
      setPlaying(false);
      setProgress(0);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: todayKey(), briefing: data }));
    } catch {
      setError("Could not generate briefing. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play(); setPlaying(true); }
  }

  function formatTime(s: number) {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * duration;
  }

  return (
    <section className="card briefing-card" aria-label="Daily audio briefing">
      <div className="card-header">
        <span className="card-icon briefing-icon" aria-hidden="true">🎙️</span>
        <div className="briefing-title-block">
          <span className="card-title">Morning Briefing</span>
          <span className="briefing-date">{formatDate()}</span>
        </div>
        {briefing?.isMock && <span className="mock-badge">Demo</span>}
      </div>

      {briefing ? (
        <>
          {/* Audio element */}
          <audio
            ref={audioRef}
            src={briefing.audioUrl}
            onTimeUpdate={() => {
              const a = audioRef.current;
              if (a) setProgress(a.currentTime);
            }}
            onLoadedMetadata={() => {
              const a = audioRef.current;
              if (a) setDuration(a.duration);
            }}
            onEnded={() => setPlaying(false)}
          />

          {/* Player */}
          <div className="player">
            <button className="play-btn" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
              {playing ? "⏸" : "▶️"}
            </button>
            <div className="track">
              <div className="progress-bar" onClick={seek} role="slider" aria-label="Seek">
                <div
                  className="progress-fill"
                  style={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }}
                />
              </div>
              <div className="times">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          {/* Script toggle */}
          <button className="script-toggle" onClick={() => setScriptOpen(o => !o)}>
            {scriptOpen ? "Hide script ▲" : "Read script ▼"}
          </button>
          {scriptOpen && (
            <pre className="script-text">{briefing.script}</pre>
          )}

          <button className="regen-btn" onClick={generate} disabled={loading}>
            {loading ? "Generating..." : "↻ Regenerate"}
          </button>
        </>
      ) : (
        <div className="empty-state">
          <p className="empty-text">No briefing generated yet for today.</p>
          <button className="generate-btn" onClick={generate} disabled={loading}>
            {loading ? (
              <><span className="spinner" /> Generating...</>
            ) : (
              "🎙️ Generate Today\'s Briefing"
            )}
          </button>
          {error && <p className="error-text">{error}</p>}
        </div>
      )}

      <style jsx>{`
        .briefing-card {
          background: linear-gradient(135deg, var(--color-sea) 0%, #0c4a6e 100%);
          color: #fff;
          border: none;
        }
        .briefing-icon {
          background: rgba(255,255,255,0.15) !important;
          color: #fff !important;
        }
        .briefing-title-block {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .card-title {
          color: rgba(255,255,255,0.75) !important;
        }
        .briefing-date {
          font-size: 15px;
          font-weight: 600;
          color: #fff;
          line-height: 1.2;
        }
        .mock-badge {
          margin-left: auto;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 2px 8px;
          border-radius: 20px;
          background: rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.7);
        }
        /* Player */
        .player {
          display: flex;
          align-items: center;
          gap: var(--sp-3);
          margin: var(--sp-4) 0 var(--sp-3);
        }
        .play-btn {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.15);
          color: #fff;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .play-btn:hover { background: rgba(255,255,255,0.25); }
        .track { flex: 1; min-width: 0; }
        .progress-bar {
          height: 6px;
          background: rgba(255,255,255,0.2);
          border-radius: 3px;
          cursor: pointer;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: #fff;
          border-radius: 3px;
          transition: width 0.1s linear;
        }
        .times {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-data);
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          margin-top: 4px;
        }
        /* Script */
        .script-toggle {
          display: inline-block;
          background: none;
          border: none;
          color: rgba(255,255,255,0.65);
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          padding: 0;
          margin-bottom: var(--sp-2);
        }
        .script-toggle:hover { color: #fff; }
        .script-text {
          font-family: var(--font-body);
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.08);
          border-radius: var(--radius-sm);
          padding: var(--sp-3);
          white-space: pre-wrap;
          margin-bottom: var(--sp-3);
        }
        .regen-btn {
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.6);
          background: none;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: var(--radius-sm);
          padding: 6px 14px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .regen-btn:hover { color: #fff; border-color: rgba(255,255,255,0.5); }
        /* Empty state */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--sp-3);
          padding: var(--sp-5) 0 var(--sp-3);
          text-align: center;
        }
        .empty-text {
          font-size: 14px;
          color: rgba(255,255,255,0.65);
        }
        .generate-btn {
          display: flex;
          align-items: center;
          gap: var(--sp-2);
          padding: 12px 24px;
          border-radius: var(--radius-md);
          border: 2px solid rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.15);
          color: #fff;
          font-family: var(--font-body);
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .generate-btn:hover { background: rgba(255,255,255,0.25); }
        .generate-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .error-text {
          font-size: 13px;
          color: rgba(255,180,180,1);
        }
      `}</style>
    </section>
  );
}
