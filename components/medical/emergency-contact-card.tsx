'use client';

import type { EmergencyContact } from "@/types/medical";

interface Props {
  contact: EmergencyContact;
}

export default function EmergencyContactCard({ contact }: Props) {
  const availabilityBadge = contact.is24Hour
    ? '24/7'
    : contact.available
      ? 'Available'
      : 'On-call';

  const availabilityClass = contact.is24Hour
    ? 'badge-24'
    : contact.available
      ? 'badge-available'
      : 'badge-oncall';

  return (
    <div className="contact-card card">
      <div className="card-top">
        <div className="contact-info">
          <h3 className="contact-name">{contact.name}</h3>
          <p className="contact-role">{contact.role}</p>
        </div>
        <div className={`availability-badge ${availabilityClass}`}>
          {availabilityBadge}
        </div>
      </div>

      <div className="contact-phones">
        <a href={`tel:${contact.phone}`} className="phone-link">
          <span className="phone-label">Primary</span>
          <span className="phone-number">{contact.phone}</span>
        </a>

        {contact.phoneAlt && (
          <a href={`tel:${contact.phoneAlt}`} className="phone-link">
            <span className="phone-label">Alternative</span>
            <span className="phone-number">{contact.phoneAlt}</span>
          </a>
        )}
      </div>

      {contact.availableHours && (
        <div className="contact-hours">
          <span className="hours-label">Hours</span>
          <span className="hours-text">{contact.availableHours}</span>
        </div>
      )}

      {contact.notes && (
        <p className="contact-notes">{contact.notes}</p>
      )}

      <style jsx>{`
        .contact-card {
          display: flex;
          flex-direction: column;
          gap: var(--sp-3);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: var(--sp-2);
        }

        .contact-info {
          flex: 1;
          min-width: 0;
        }

        .contact-name {
          font-size: 16px;
          font-weight: 600;
          color: var(--color-night);
          margin-bottom: var(--sp-1);
        }

        .contact-role {
          font-size: 13px;
          color: var(--color-desert);
          font-weight: 500;
        }

        .availability-badge {
          flex-shrink: 0;
          padding: var(--sp-1) var(--sp-2);
          border-radius: var(--radius-sm);
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          white-space: nowrap;
        }

        .badge-24 {
          background: var(--color-danger-light);
          color: var(--color-danger);
        }

        .badge-available {
          background: var(--color-sea-faint);
          color: var(--color-sea);
        }

        .badge-oncall {
          background: var(--color-sun-light);
          color: var(--color-sun);
        }

        .contact-phones {
          display: flex;
          flex-direction: column;
          gap: var(--sp-2);
        }

        .phone-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--sp-2) var(--sp-3);
          background: var(--color-sand);
          border-radius: var(--radius-sm);
          text-decoration: none;
          transition: background 0.15s ease;
        }

        .phone-link:hover {
          background: #e8dfd5;
          text-decoration: none;
        }

        .phone-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--color-desert);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .phone-number {
          font-family: var(--font-data);
          font-size: 14px;
          font-weight: 500;
          color: var(--color-sea);
        }

        .contact-hours {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--sp-2) 0;
          border-top: 1px solid var(--color-sand);
          border-bottom: 1px solid var(--color-sand);
        }

        .hours-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--color-desert);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .hours-text {
          font-size: 14px;
          color: var(--color-night);
          font-weight: 500;
        }

        .contact-notes {
          font-size: 14px;
          color: var(--color-desert);
          line-height: 1.5;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
