'use client';

import { useState } from 'react';
import EventSubmissionForm from './event-submission-form';
import AnnouncementSubmissionForm from './announcement-submission-form';
import MedicalCorrectionForm from './medical-correction-form';

export default function SubmitUpdateShell() {
  const [activeTab, setActiveTab] = useState<'event' | 'announcement' | 'medical'>('event');

  return (
    <div className="submit-shell">
      <div className="shell-header">
        <h1 className="shell-title">Submit Updates</h1>
        <p className="shell-subtitle">
          Help us keep the Posada community dashboard accurate and up-to-date
        </p>
      </div>

      <div className="tabs">
        <button
          onClick={() => setActiveTab('event')}
          className={`tab ${activeTab === 'event' ? 'active' : ''}`}
          aria-selected={activeTab === 'event'}
        >
          <span className="tab-icon" aria-hidden="true">📅</span>
          <span className="tab-label">Event</span>
        </button>

        <button
          onClick={() => setActiveTab('announcement')}
          className={`tab ${activeTab === 'announcement' ? 'active' : ''}`}
          aria-selected={activeTab === 'announcement'}
        >
          <span className="tab-icon" aria-hidden="true">📢</span>
          <span className="tab-label">Announcement</span>
        </button>

        <button
          onClick={() => setActiveTab('medical')}
          className={`tab ${activeTab === 'medical' ? 'active' : ''}`}
          aria-selected={activeTab === 'medical'}
        >
          <span className="tab-icon" aria-hidden="true">⚕️</span>
          <span className="tab-label">Medical Info</span>
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'event' && <EventSubmissionForm />}
        {activeTab === 'announcement' && <AnnouncementSubmissionForm />}
        {activeTab === 'medical' && <MedicalCorrectionForm />}
      </div>

      <style jsx>{`
        .submit-shell {
          display: flex;
          flex-direction: column;
          gap: var(--sp-5);
        }

        .shell-header {
          text-align: center;
          margin-bottom: var(--sp-2);
        }

        .shell-title {
          font-size: 32px;
          font-weight: 700;
          color: var(--color-night);
          margin: 0 0 var(--sp-2) 0;
        }

        .shell-subtitle {
          font-size: 16px;
          color: var(--color-desert);
          margin: 0;
        }

        .tabs {
          display: flex;
          gap: var(--sp-2);
          border-bottom: 2px solid var(--color-sand);
          overflow-x: auto;
        }

        .tab {
          display: flex;
          align-items: center;
          gap: var(--sp-2);
          padding: var(--sp-3) var(--sp-4);
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          font-family: var(--font-body);
          font-size: 15px;
          font-weight: 600;
          color: var(--color-desert);
          transition: all 0.2s ease;
          white-space: nowrap;
          margin-bottom: -2px;
        }

        .tab:hover {
          color: var(--color-night);
        }

        .tab.active {
          color: var(--color-sea);
          border-bottom-color: var(--color-sea);
        }

        .tab-icon {
          font-size: 18px;
        }

        .tab-label {
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .tab-content {
          padding: var(--sp-5) 0;
        }

        @media (max-width: 640px) {
          .shell-title {
            font-size: 24px;
          }

          .tabs {
            gap: 0;
            margin: 0 calc(var(--sp-4) * -1);
            padding: 0 var(--sp-4);
          }

          .tab {
            padding: var(--sp-2) var(--sp-3);
            font-size: 13px;
          }

          .tab-icon {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}
