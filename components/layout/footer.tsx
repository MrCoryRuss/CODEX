"use client";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-text">
          Posada Underground · Bahía Concepción, BCS
        </p>
        <p className="footer-sub">
          Weather data from Open-Meteo · Not affiliated with any government agency
        </p>
        <p className="footer-sub">
          © {year} · Built for the community
        </p>
      </div>

      <style jsx>{`
        .footer {
          background: var(--color-night);
          color: rgba(255, 255, 255, 0.6);
          padding: var(--sp-6) var(--sp-4);
          margin-top: var(--sp-8);
          text-align: center;
        }

        .footer-inner {
          max-width: var(--max-width);
          margin: 0 auto;
        }

        .footer-text {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: var(--sp-2);
        }

        .footer-sub {
          font-size: 13px;
          line-height: 1.6;
        }
      `}</style>
    </footer>
  );
}
