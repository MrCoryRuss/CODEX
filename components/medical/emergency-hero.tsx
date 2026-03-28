'use client';

export default function EmergencyHero() {
  const handleCall911 = () => {
    window.location.href = 'tel:911';
  };

  return (
    <section className="emergency-hero" aria-label="Emergency contacts banner">
      <div className="hero-content">
        <div className="hero-icon" aria-hidden="true">🚨</div>
        <h1 className="hero-title">Emergency Contacts</h1>
        <p className="hero-subtitle">
          Critical numbers and first responders available 24/7
        </p>
      </div>

      <button
        onClick={handleCall911}
        className="call-button"
        aria-label="Call emergency number 911"
      >
        <span className="button-icon" aria-hidden="true">☎️</span>
        <span className="button-text">Call 911</span>
      </button>

      <style jsx>{`
        .emergency-hero {
          background: linear-gradient(135deg, var(--color-danger) 0%, #b71c1c 100%);
          border-radius: var(--radius-lg);
          padding: var(--sp-7) var(--sp-4);
          margin-bottom: var(--sp-5);
          color: var(--color-white);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: var(--sp-5);
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--sp-3);
        }

        .hero-icon {
          font-size: 48px;
          line-height: 1;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        .hero-title {
          font-size: 32px;
          font-weight: 700;
          color: var(--color-white);
        }

        .hero-subtitle {
          font-size: 16px;
          line-height: 1.6;
          opacity: 0.95;
          max-width: 400px;
        }

        .call-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--sp-2);
          padding: var(--sp-4) var(--sp-6);
          background: var(--color-white);
          color: var(--color-danger);
          border: none;
          border-radius: var(--radius-md);
          font-size: 16px;
          font-weight: 600;
          font-family: var(--font-body);
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .call-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }

        .call-button:active {
          transform: translateY(0);
        }

        .button-icon {
          font-size: 20px;
        }

        .button-text {
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        @media (min-width: 640px) {
          .emergency-hero {
            padding: var(--sp-8) var(--sp-6);
            gap: var(--sp-6);
          }

          .hero-title {
            font-size: 40px;
          }
        }
      `}</style>
    </section>
  );
}
