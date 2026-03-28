'use client';

import { useState } from 'react';

export default function MedicalCorrectionForm() {
  const [formData, setFormData] = useState({
    facility: '',
    field: '',
    currentValue: '',
    suggestedValue: '',
    reason: '',
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
        facility: '',
        field: '',
        currentValue: '',
        suggestedValue: '',
        reason: '',
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
        <h3 className="success-title">Correction Submitted</h3>
        <p className="success-text">
          Thank you for helping us keep medical information accurate. Our team will review your submission.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="facility" className="form-label">
            Medical Facility Name <span className="required">*</span>
          </label>
          <input
            id="facility"
            type="text"
            name="facility"
            value={formData.facility}
            onChange={handleChange}
            placeholder="e.g., Centro de Salud Posada, Farmacia San Miguel"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="field" className="form-label">
            Information Field <span className="required">*</span>
          </label>
          <select
            id="field"
            name="field"
            value={formData.field}
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="">Select a field to correct...</option>
            <option value="phone">Phone Number</option>
            <option value="hours">Operating Hours</option>
            <option value="address">Physical Address</option>
            <option value="services">Services Offered</option>
            <option value="insurance">Insurance Accepted</option>
            <option value="availability">Walk-in Availability</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="currentValue" className="form-label">
              Current Information <span className="required">*</span>
            </label>
            <input
              id="currentValue"
              type="text"
              name="currentValue"
              value={formData.currentValue}
              onChange={handleChange}
              placeholder="What is currently listed"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="suggestedValue" className="form-label">
              Correct Information <span className="required">*</span>
            </label>
            <input
              id="suggestedValue"
              type="text"
              name="suggestedValue"
              value={formData.suggestedValue}
              onChange={handleChange}
              placeholder="What it should be"
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="reason" className="form-label">
            Why This Correction Matters <span className="required">*</span>
          </label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Please explain why this information needs to be updated (e.g., 'The facility recently changed their phone number', 'Hours have changed with new management')"
            className="form-input form-textarea"
            rows={4}
            required
          />
        </div>

        <div className="info-box">
          <span className="info-icon" aria-hidden="true">ℹ️</span>
          <div className="info-content">
            <p className="info-text">
              Corrections are reviewed by our moderation team to ensure accuracy. Please provide specific details and evidence if available.
            </p>
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
            <span>Submit Correction</span>
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
          min-height: 120px;
        }

        .info-box {
          display: flex;
          gap: var(--sp-3);
          padding: var(--sp-3) var(--sp-4);
          background: var(--color-sea-faint);
          border-left: 3px solid var(--color-sea);
          border-radius: var(--radius-sm);
        }

        .info-icon {
          font-size: 20px;
          flex-shrink: 0;
        }

        .info-content {
          flex: 1;
        }

        .info-text {
          font-size: 14px;
          color: var(--color-night);
          line-height: 1.5;
          margin: 0;
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

          .info-box {
            flex-direction: column;
          }
        }
      `}</style>
    </form>
  );
}
