"use client";

import { useState } from "react";
import type { AudioBriefing } from "./mock-data";

interface Props {
  briefing: AudioBriefing;
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AudioBriefingCard({ briefing }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="card audio-card" aria-label="Daily audio briefing">
      <div className="card-header">
        <span className="card-icon audio-icon" aria-hidden="true">🎙</span>
        <span className="card-title audio-title">Daily Briefing</span>
      </div>

      <p className="audio-date">{briefing.dateFormatted}</p>

      <div className="audio-player">
        <button className="audio-play" aria-label="Play daily briefing">
          ▶
        </button>
        <div className="audio-track">
          <div className="audio-bar">
            <div className="audio-progress" />
          </div>
          <div className="audio-times">
            <span>0:00</span>
            <span>{formatDuration(briefing.durationSec)}</span>
          </div>
        </div>
      </div>

      {/* Expandable transcript / summary */}
      <button
        className="audio-expand"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        {expanded ? "Hide summary ▲" : "Read summary ▼"}
      </button>

      {expanded && (
        <p className="audio-summary">{briefing.summary}</p>
      )}

      <div className="audio-footer">
        <a href="/briefing" className="audio-archive-link">Past briefings →</a>
      </div>

      <style jsx>{`
        .audio-card {
          background: var(--color-sea);
          color: var(--color-white);
        }

        .audio-icon {
          background: rgba(255, 255, 255, 0.15) !important;
          color: var(--color-white) !important;
        }

        .audio-title {
          color: rgba(255, 255, 255, 0.75) !important;
        }

        .audio-date {
          font-size: 15px;
          font-weight: 500;
          margin-bottom: var(--sp-3);
        }

        .audio-player {
          display: flex;
          align-items: center;
          gap: var(--sp-3);
        }

        .audio-play {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.1);
          color: var(--color-white);
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.12s ease;
        }

        .audio-play:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .audio-track {
          flex: 1;
          min-width: 0;
        }

        .audio-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          overflow: hidden;
        }

        .audio-progress {
          width: 0%;
          height: 100%;
          background: var(--color-white);
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .audio-times {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-data);
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 4px;
        }

        .audio-expand {
          display: inline-block;
          margin-top: var(--sp-3);
          padding: 0;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.1s ease;
        }

        .audio-expand:hover {
          color: var(--color-white);
        }

        .audio-summary {
          margin-top: var(--sp-2);
          font-size: 15px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.85);
          padding: var(--sp-3);
          background: rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-sm);
        }

        .audio-footer {
          margin-top: var(--sp-3);
        }

        .audio-archive-link {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
        }

        .audio-archive-link:hover {
          color: var(--color-white);
          text-decoration: underline;
        }
      `}</style>
    </section>
  );
}
