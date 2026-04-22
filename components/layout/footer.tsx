"use client";
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-brand">Posada Underground &middot; Bahía Concepción, BCS</p>
        <p className="footer-sub">Weather data from Open-Meteo &middot; Not affiliated with any government entity</p>
        <p className="footer-sub">&copy; {year} &middot; Built for the community</p>
      </div>
      <style jsx>{`
        .footer {
          background: #2C1810;
          color: rgba(242,234,216,0.45);
          padding: var(--sp-8) var(--sp-4);
          margin-top: var(--sp-8);
          text-align: center;
        }
        .footer-inner { max-width: var(--max-width); margin: 0 auto; display: flex; flex-direction: column; gap: var(--sp-2); }
        .footer-brand { font-size: 14px; font-weight: 600; color: rgba(242,234,216,0.85); letter-spacing: 0.01em; }
        .footer-sub { font-size: 12px; }
      `}</style>
    </footer>
  );
}
