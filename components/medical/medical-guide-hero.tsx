'use client';
export default function MedicalGuideHero() {
  return (
    <section className="hero" aria-label="Medical guide welcome">
      <div className="hero-content">
        <h1 className="hero-title">Medical Guide</h1>
        <p className="hero-subtitle">
          Emergency contacts, facilities, and health resources available to Posada Concepción and surrounding communities
        </p>
      </div>

      <div className="search-cta">
        <div className="search-input">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            type="text"
            placeholder="Search facilities, services, or emergency numbers..."
            className="search-field"
            aria-label="Search medical resources"
          />
        </div>
      </div>

      <style jsx>{`
        .hero {
          background: linear-gradient(135deg, var(--color-sea) 0%, var(--color-sea-light) 100%);
          border-radius: var(--radius-lg);
          padding: var(--sp-7) var(--sp-4);
          margin-bottom: var(--sp-5);
          color: var(--color-white);
        }

        .hero-content {
          margin-bottom: var(--sp-5);
        }

        .hero-title {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: var(--sp-2);
          color: var(--color-white);
        }

        .hero-subtitle {
          font-size: 16px;
          line-height: 1.6;
          opacity: 0.95;
          max-width: 600px;
        }

        .search-cta {
          display: flex;
          flex-direction: column;
          gap: var(--sp-2);
        }

        .search-input {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: var(--sp-3);
          font-size: 18px;
          pointer-events: none;
        }

        .search-field {
          width: 100%;
          padding: var(--sp-3) var(--sp-4) var(--sp-3) var(--sp-5);
          border: none;
          border-radius: var(--radius-md);
          font-size: 15px;
          font-family: var(--font-body);
          background: var(--color-white);
          color: var(--color-night);
        }

        .search-field::placeholder {
          color: var(--color-desert);
        }

        .search-field:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
        }

        @media (min-width: 640px) {
          .hero {
            padding: var(--sp-8) var(--sp-6);
          }

          .hero-title {
            font-size: 40px;
          }
        }
      `}</style>
    </section>
  );
}
