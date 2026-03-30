'use client';

import { useState, useRef } from 'react';
import type { AudioEpisode } from '@/types/audio-briefing';

interface Props {
  episode: AudioEpisode;
  featured?: boolean;
}

export default function AudioPlayerCard({ episode }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const episodeDate = new Date(episode.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="player-card card">
      <audio
        ref={audioRef}
        src={episode.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="player-header">
        <div className="episode-info">
          <div className="episode-date">{episodeDate}</div>
          <h2 className="episode-title">{episode.title}</h2>
          <p className="episode-summary">{episode.summary}</p>
        </div>
      </div>

      <div className="player-controls">
        <button
          onClick={handlePlayPause}
          className="play-button"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          <span className="play-icon" aria-hidden="true">
            {isPlaying ? '⏸' : '▶'}
          </span>
        </button>

        <div className="progress-section">
          <input
            type="range"
            min="0"
            max={episode.durationSec}
            value={currentTime}
            onChange={handleSeek}
            className="progress-bar"
            aria-label="Audio progress"
          />
          <div className="time-display">
            <span className="time-current">{formatTime(currentTime)}</span>
            <span className="time-duration">{formatTime(episode.durationSec)}</span>
          </div>
        </div>
      </div>

      <div className="player-footer">
        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="transcript-toggle"
        >
          <span className="toggle-icon" aria-hidden="true">{showTranscript ? '▼' : '▶'}</span>
          <span className="toggle-text">Transcript</span>
        </button>
      </div>

      {showTranscript && (
        <div className="transcript-section">
          <p className="transcript-text">{episode.transcript}</p>
        </div>
      )}

      <style jsx>{`
        .player-card {
          display: flex;
          flex-direction: column;
          gap: var(--sp-4);
        }

        .player-header {
          display: flex;
          gap: var(--sp-3);
        }

        .episode-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--sp-2);
        }

        .episode-date {
          font-size: 12px;
          font-weight: 600;
          color: var(--color-desert);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .episode-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--color-night);
          margin: 0;
        }

        .episode-summary {
          font-size: 14px;
          color: var(--color-desert);
          line-height: 1.5;
          margin: 0;
        }

        .player-controls {
          display: flex;
          align-items: center;
          gap: var(--sp-3);
        }

        .play-button {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--color-sea);
          color: var(--color-white);
          border: none;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .play-button:hover {
          background: #1560a0;
          transform: scale(1.05);
        }

        .play-button:active {
          transform: scale(0.98);
        }

        .play-icon {
          line-height: 1;
        }

        .progress-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--sp-2);
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          -webkit-appearance: none;
          appearance: none;
          background: var(--color-sand);
          outline: none;
          cursor: pointer;
        }

        .progress-bar::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--color-sea);
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .progress-bar::-webkit-slider-thumb:hover {
          background: #1560a0;
        }

        .progress-bar::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--color-sea);
          border: none;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .progress-bar::-moz-range-thumb:hover {
          background: #1560a0;
        }

        .time-display {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-data);
          font-size: 12px;
          font-weight: 500;
          color: var(--color-desert);
        }

        .time-current {
          color: var(--color-sea);
        }

        .player-footer {
          border-top: 1px solid var(--color-sand);
          padding-top: var(--sp-3);
        }

        .transcript-toggle {
          display: flex;
          align-items: center;
          gap: var(--sp-2);
          padding: var(--sp-2) 0;
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 600;
          color: var(--color-sea);
          transition: color 0.2s ease;
        }

        .transcript-toggle:hover {
          color: #1560a0;
        }

        .toggle-icon {
          font-size: 12px;
          line-height: 1;
        }

        .toggle-text {
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .transcript-section {
          padding: var(--sp-3) var(--sp-4);
          background: var(--color-sand);
          border-radius: var(--radius-md);
          margin-top: var(--sp-3);
        }

        .transcript-text {
          font-size: 14px;
          line-height: 1.7;
          color: var(--color-night);
          margin: 0;
        }
      `}</style>
    </div>
  );
}
