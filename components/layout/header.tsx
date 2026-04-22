"use client";
import Link from "next/link";
export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="header-brand">
          <span className="header-logo" aria-hidden="true">🌊</span>
          <div className="header-text">
            <span className="header-title">Posada Underground</span>
            <span className="header-tagline">Bahía Concepción, BCS</span>
          </div>
        </Link>
        <div className="header-badge"><span className="badge-dot" /><span className="badge-text">Live</span></div>
      </div>
      <style jsx>{`
        .header {
          position: sticky; top: 0; z-index: 100;
          background: #2C1810;
          border-bottom: 1px solid rgba(242,234,216,0.12);
          height: var(--header-height);
          display: flex; align-items: center;
        }
        .header-inner {
          width: 100%; max-width: var(--max-width); margin: 0 auto;
          padding: 0 var(--sp-4);
          display: flex; align-items: center; justify-content: space-between;
        }
        .header-brand { display: flex; align-items: center; gap: var(--sp-3); color: #FBF6EC; text-decoration: none; }
        .header-brand:hover { text-decoration: none; opacity: 0.85; }
        .header-logo { font-size: 24px; line-height: 1; }
        .header-text { display: flex; flex-direction: column; }
        .header-title {
          font-family: var(--font-display);
          font-size: 18px; font-weight: 700; letter-spacing: 0em;
          color: #FBF6EC; line-height: 1.2;
        }
        .header-tagline { font-size: 11px; color: #9E7B5E; line-height: 1.2; display: none; letter-spacing: 0.04em; }
        .header-badge {
          display: flex; align-items: center; gap: 6px;
          padding: 4px 10px;
          background: rgba(212,136,42,0.15);
          border-radius: 20px;
          border: 1px solid rgba(212,136,42,0.3);
        }
        .badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #D4882A;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        .badge-text { font-size: 12px; font-weight: 600; color: #D4882A; letter-spacing: 0.04em; }
        @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
        @media (min-width: 640px) { .header-tagline { display: block; } }
      `}</style>
    </header>
  );
}
