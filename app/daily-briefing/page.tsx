'use client';
import { AudioPlayerCard, AudioArchiveList } from "@/components/audio";
import {
  getLatestBriefing,
  getBriefingArchive,
} from "@/lib/audio-briefing";

export default async function DailyBriefingPage() {
  // Fetch latest briefing and archive
  const latestBriefing = getLatestBriefing();
  const archive = getBriefingArchive(30);

  return (
    <div className="page-container">
      <div className="briefing-header">
        <h1>Daily Briefing</h1>
        <p className="header-subtitle">
          Your daily audio update on weather, wind, water conditions, and
          community events. New briefing published every morning at 6 AM.
        </p>
      </div>

      {/* Latest briefing */}
      {latestBriefing ? (
        <section className="latest-section">
          <h2 className="section-title">Today's Briefing</h2>
          <AudioPlayerCard episode={latestBriefing} featured={true} />

          {/* Transcript if available */}
          {latestBriefing.transcript && (
            <details className="transcript-details">
              <summary>View Transcript</summary>
              <div className="transcript-content">
                <p>{latestBriefing.transcript}</p>
              </div>
            </details>
          )}
        </section>
      ) : (
        <section className="latest-section">
          <div className="no-briefing">
            <p>No briefing available yet today. Check back soon!</p>
          </div>
        </section>
      )}

      {/* Archive of past briefings */}
      {archive.length > 0 && (
        <section className="archive-section">
          <h2 className="section-title">Archive</h2>
          <p className="archive-subtitle">
            Listen to previous briefings from the last 30 days
          </p>
          <AudioArchiveList episodes={archive} />
        </section>
      )}

      <style jsx>{`
        .page-container {
          max-width: 900px;
          margin: 0 auto;
          padding: var(--sp-4);
        }

        .briefing-header {
          background: linear-gradient(
            135deg,
            var(--color-sun) 0%,
            var(--color-sun-light) 100%
          );
          color: var(--color-white);
          padding: var(--sp-6) var(--sp-4);
          border-radius: var(--radius-lg);
          margin-bottom: var(--sp-7);
        }

        .briefing-header h1 {
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 var(--sp-2) 0;
          color: var(--color-white);
        }

        .header-subtitle {
          font-size: 15px;
          margin: 0;
          opacity: 0.95;
          max-width: 600px;
          line-height: 1.6;
        }

        .latest-section {
          margin-bottom: var(--sp-8);
        }

        .section-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: var(--sp-4);
          color: var(--color-night);
        }

        .archive-subtitle {
          font-size: 14px;
          color: var(--color-gray);
          margin-bottom: var(--sp-4);
        }

        .no-briefing {
          background: var(--color-sand-light);
          border-radius: var(--radius-md);
          padding: var(--sp-6);
          text-align: center;
          color: var(--color-gray);
        }

        .transcript-details {
          margin-top: var(--sp-4);
          padding: var(--sp-4);
          background: var(--color-gray-light);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-sand);
        }

        .transcript-details summary {
          cursor: pointer;
          font-weight: 600;
          color: var(--color-sea);
          padding: var(--sp-2);
          user-select: none;
        }

        .transcript-details summary:hover {
          color: var(--color-sea-dark);
        }

        .transcript-content {
          margin-top: var(--sp-3);
          padding-top: var(--sp-3);
          border-top: 1px solid var(--color-sand);
        }

        .transcript-content p {
          font-size: 14px;
          line-height: 1.7;
          color: var(--color-gray-dark);
          margin: 0;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .archive-section {
          margin-top: var(--sp-8);
          padding-top: var(--sp-6);
          border-top: 2px solid var(--color-sand);
        }

        @media (min-width: 640px) {
          .page-container {
            padding: var(--sp-6);
          }

          .briefing-header {
            padding: var(--sp-8) var(--sp-6);
          }

          .briefing-header h1 {
            font-size: 40px;
          }

          .section-title {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
}
