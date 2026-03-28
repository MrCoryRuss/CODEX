'use client';

import { useState } from 'react';

export default function EventSubmissionForm() {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    location: '',
    description: '',
    category: 'social',
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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setIsSubmitting(false);
    setSubmitted(true);

    setTimeout(() => {
      setFormData({
        title: '',
        date: '',
        startTime: '',
        location: '',
        description: '',
        category: 'social',
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
        <h3 className="success-title">Event Submitted</h3>
        <p className="success-text">
          Thank you! Your event has been submitted for review and will be published shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Event Title <span className="required">*</span>
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Community Soccer Tournament"
            className="form-input"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date" className="form-label">
              Date <span className="required">*</span>
            </label>
            <input
              id="date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="startTime" className="form-label">
              Start Time <span className="required">*</span>
            </label>
            <input
              id="startTime"
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="location" className="form-label">
            Location <span className="required">*</span>
          </label>
          <input
            id="location"
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Plaza Principal, Posada Concepción"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category" className="form-label">
            Category <span className="required">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="social">Social & Recreation</option>
            <option value="service">Community Service</option>
            <option value="market">Market & Commerce</option>
            <option value="medical">Medical & Health</option>
            <option value="cultural">Cultural & Arts</option>
            <option value="education">Education & Learning</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description <span className="required">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tell us about the event - what will happen, who should attend, etc."
            className="form-input form-textarea"
            rows={5}
            required
          />
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
            <span>Submit Event</span>
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
        }
      `}</style>
    </form>
  );
}
