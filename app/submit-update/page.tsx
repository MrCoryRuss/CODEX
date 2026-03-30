'use client';
import { SubmitUpdateShell } from "@/components/forms";

export default function SubmitUpdatePage() {
  return (
    <div className="page-container">
      <div className="submit-header">
        <h1>Submit an Update</h1>
        <p className="header-subtitle">
          Share community news, upcoming events, announcements, or corrections
          to medical information. Your submission will be reviewed by our
          moderation team before appearing on the site.
        </p>
      </div>

      <div className="form-wrapper">
        <SubmitUpdateShell />
      </div>

      <style jsx>{`
        .page-container {
          max-width: 700px;
          margin: 0 auto;
          padding: var(--sp-4);
        }

        .submit-header {
          background: linear-gradient(
            135deg,
            var(--color-sea) 0%,
            var(--color-sea-light) 100%
          );
          color: var(--color-white);
          padding: var(--sp-6) var(--sp-4);
          border-radius: var(--radius-lg);
          margin-bottom: var(--sp-7);
        }

        .submit-header h1 {
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 var(--sp-2) 0;
        }

        .header-subtitle {
          font-size: 15px;
          margin: 0;
          opacity: 0.95;
          line-height: 1.6;
        }

        .form-wrapper {
          background: var(--color-white);
          border-radius: var(--radius-lg);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        @media (min-width: 640px) {
          .page-container {
            padding: var(--sp-6);
          }

          .submit-header {
            padding: var(--sp-8) var(--sp-6);
          }

          .submit-header h1 {
            font-size: 40px;
          }
        }
      `}</style>
    </div>
  );
}
