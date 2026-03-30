'use client';
import type { AudioEpisode } from "@/types/audio-briefing";

interface Props {
  episodes: AudioEpisode[];
}

export default function AudioArchiveList({ episodes }: Props) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section aria-label="Audio briefing archive">
      <h2 className="section-title">Past Episodes</h2>

      <div className="episodes-table">
        <div className="table-header">
          <div className="col-date">Date</div>
          <div className="col-title">Episode</div>
          <div className="col-duration">Duration</div>
          <div className="col-action">Play</div>
        </div>

        <div className="table-body">
          {episodes.map((episode) => (
            <a
              key={episode.id}
              href={episode.episodeUrl || episode.audioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="table-row"
            >
              <div className="col-date">
                <span className="row-date">{formatDate(episode.date)}</span>
              </div>
              <div className="col-title">
                <span className="row-title">{episode.title}</span>
              </div>
              <div className="col-duration">
                <span className="row-duration">{formatDuration(episode.durationSec)}</span>
              </div>
              <div className="col-action">
                <span className="play-btn" aria-hidden="true">▶</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <style jsx>{`
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--color-night);
          margin-bottom: var(--sp-4);
        }

        .episodes-table {
          background: var(--color-white);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-card);
          overflow: hidden;
        }

        .table-header {
          display: grid;
          grid-template-columns: 1fr 2fr 1fr 1fr;
          gap: var(--sp-3);
          padding: var(--sp-4);
          background: var(--color-sand);
          border-bottom: 1px solid #e0d5cd;
          font-weight: 600;
          font-size: 12px;
          color: var(--color-desert);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .col-date, .col-title, .col-duration, .col-action {
          display: flex;
          align-items: center;
        }

        .col-action {
          justify-content: flex-end;
        }

        .table-body {
          display: flex;
          flex-direction: column;
        }

        .table-row {
          display: grid;
          grid-template-columns: 1fr 2fr 1fr 1fr;
          gap: var(--sp-3);
          padding: var(--sp-4);
          border-bottom: 1px solid var(--color-sand);
          text-decoration: none;
          color: inherit;
          transition: background 0.15s ease;
        }

        .table-row:last-child {
          border-bottom: none;
        }

        .table-row:hover {
          background: var(--color-sand);
        }

        .table-row:active {
          background: #e8dfd5;
        }

        .row-date {
          font-family: var(--font-data);
          font-size: 14px;
          font-weight: 500;
          color: var(--color-sea);
        }

        .row-title {
          font-size: 15px;
          font-weight: 500;
          color: var(--color-night);
        }

        .row-duration {
          font-family: var(--font-data);
          font-size: 14px;
          font-weight: 500;
          color: var(--color-desert);
        }

        .play-btn {
          font-size: 16px;
          color: var(--color-sea);
          transition: transform 0.2s ease;
        }

        .table-row:hover .play-btn {
          transform: scale(1.2);
        }

        @media (max-width: 640px) {
          .table-header {
            display: none;
          }

          .table-row {
            grid-template-columns: 1fr auto;
            padding: var(--sp-3);
            gap: var(--sp-2);
          }

          .col-duration,
          .col-action {
            display: none;
          }

          .row-title {
            grid-column: 1;
            font-size: 14px;
          }

          .row-date {
            grid-column: 2;
            grid-row: 1;
            text-align: right;
            font-size: 12px;
          }

          .col-action {
            display: flex;
            grid-column: 2;
            grid-row: 2;
            justify-content: flex-end;
            align-items: center;
          }

          .play-btn {
            font-size: 14px;
          }
        }
      `}</style>
    </section>
  );
}
