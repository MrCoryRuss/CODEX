'use client';

import { useState } from 'react';

export default function AnnouncementSubmissionForm() {
  const [formData, setFormData] = useState({
    text: '',
    level: 'info',
    contactName: '',
    email: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1200));

    setIsSubmitting(false);
    setSubmitted(true);

    setTimeout(() => {
      setFormData({
        text: '',
        level: 'info',
        contactName: '',
        email: '',
      });
      setSubmitted(false);
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="success-message">
        <div className="success-icon" aria-hidden="true">✓</div>
        <h3 className="success-title">Announcement Submitted</h3>
        <p className="success-text">
          Thank you! Your announcement has been submitted for review and will be published shortly.
        </p>
      </div>
    );
  }

  const levelInfo = {
    info: { icon: 'ℹ️', color: 'sea' },
    warning: { icon: '⚠️', color: 'sun' },
    urgent: { icon: '🚨', color: 'danger' },
  };

  const selectedLevel = levelInfo[formData.level as keyof typeof levelInfo];

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="text" className="form-label">
            Announcement Text <span className="required">*</span>
          </label>
          <textarea
            id="text"
            name="text"
            value={formData.text}
            onChange={handleChange}
            placeholder="Share your announcement with the community..."
            className="form-input form-textarea"
            rows={6}
            required
          />
          <div className="char-count">
            {formData.text.length} / 500 characters
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="level" className="form-label">
            Urgency Level <span className="required">*</span>
          </label>
          <select
            id="level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="info">
              ℹ️ Informational - General news or updates
            </option>
            <option value="warning">
              ⚠️ Warning - Important notice or alert
            </option>
            <option value="urgent">
              🚨 Urgent - Critical, time-sensitive information
            </option>
          </select>
        </div>

        <div className="level-preview">
          <span className="preview-icon" aria-hidden="true">{selectedLevel.icon}</span>
          <div className="preview-text">
            <div className="preview-label">Preview</div>
            <div className={`preview-banner preview-${selectedLevel.color}`}>
              {formData.text || 'Your announcement text will appear here...'}
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="contactName" className="form-label">
              Your Name <span className="required">*</span>
            </label>
            <input
              id="contactName"
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              placeholder="Your full name"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email <span className="required">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="form-input"
              required
            />
          </div>
        </div>
      </div>

      <button type="submit" className="submit-button" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <span className="loading-spinner" aria-hidden="true">⟳</span>
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <span className="button-icon" aria-hidden="true">→</span>
            <span>Submit Announcement</span>
          </>
        )}
      </button>

      <style jsx>{`
        .form {
          display: flex;
          flex-direction: column;
          gap: var(--sp-4);
        }

        .form-grid {
          display: flex;
          flex-direction: column;
          gap: var(--sp-4);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--sp-4);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--sp-2);
        }

        .form-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-night);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .required {
          color: var(--color-danger);
        }

        .form-input {
          padding: var(--sp-3) var(--sp-3);
          border: 1px solid var(--color-desert);
          border-radius: var(--radius-md);
          font-size: 15px;
          font-family: var(--font-body);
          color: var(--color-night);
          background: var(--color-white);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .form-input::placeholder {
          color: var(--color-desert);
        }

        .form-input:focus {
          outline: none;
          border-color: var(--color-sea);
          box-shadow: 0 0 0 3px var(--color-sea-faint);
        }

        .form-textarea {
          resize: vertical;
          min-height: 140px;
          font-family: var(--font-body);
        }

        .char-count {
          font-size: 12px;
          color: var(--color-desert);
          text-align: right;
        }

        .level-preview {
          display: flex;
          gap: var(--sp-3);
          align-items: flex-start;
          padding: var(--sp-3) var(--sp-4);
          background: var(--color-sand);
          border-radius: var(--radius-md);
        }

        .preview-icon {
          font-size: 24px;
          flex-shrink: 0;
        }

        .preview-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--sp-2);
        }

        .preview-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--color-desert);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .preview-banner {
          padding: var(--sp-2) var(--sp-3);
          border-radius: var(--radius-sm);
          font-size: 14px;
          line-height: 1.5;
          border-left: 3px solid;
        }

        .preview-sea {
          background: var(--color-sea-faint);
          border-left-color: var(--color-sea);
          color: var(--color-night);
        }

        .preview-sun {
          background: var(--color-sun-light);
          border-left-color: var(--color-sun);
          color: var(--color-night);
        }

        .preview-danger {
          background: var(--color-danger-light);
          border-left-color: var(--color-danger);
          color: var(--color-night);
        }

        .submit-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--sp-2);
          padding: var(--sp-4) var(--sp-6);
          background: var(--color-sea);
          color: var(--color-white);
          border: none;
          border-radius: var(--radius-md);
          font-size: 15px;
          font-weight: 600;
          font-family: var(--font-body);
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .submit-button:hover:not(:disabled) {
          background: #1560a0;
          transform: translateY(-2px);
        }

        .submit-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .button-icon {
          font-size: 18px;
        }

        .loading-spinner {
          display: inline-block;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .success-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--sp-3);
          padding: var(--sp-6);
          background: var(--color-sea-faint);
          border-radius: var(--radius-md);
          text-align: center;
        }

        .success-icon {
          font-size: 48px;
          color: var(--color-sea);
        }

        .success-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--color-night);
        }

        .success-text {
          font-size: 14px;
          color: var(--color-desert);
          max-width: 400px;
        }

        @media (max-width: 640px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .level-preview {
            flex-direction: column;
          }
        }
      `}</style>
    </form>
  );
}
