"use client";
import Link from "next/link";
export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="header-brand">
          <span className="header-logo" aria-hidden="true">&#x1F30A;</span>
          <div className="header-text">
            <span className="header-title">Posada Underground</span>
            <span className="header-tagline">Bahia Concepcion, BCS</span>
          </div>
        </Link>
        <div className="header-badge"><span className="badge-dot" /><span className="badge-text">Live</span></div>
      </div>
      <style jsx>{`
        .header { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid var(--color-border-light); height: var(--header-height); display: flex; align-items: center; }
        .header-inner { width: 100%; max-width: var(--max-width); margin: 0 auto; padding: 0 var(--sp-4); display: flex; align-items: center; justify-content: space-between; }
        .header-brand { display: flex; align-items: center; gap: var(--sp-3); color: var(--color-text); text-decoration: none; }
        .header-brand:hover { text-decoration: none; opacity: 0.85; }
        .header-logo { font-size: 24px; line-height: 1; }
        .header-text { display: flex; flex-direction: column; }
        .header-title { font-size: 17px; font-weight: 800; letter-spacing: -0.02em; color: var(--color-text); line-height: 1.2; }
        .header-tagline { font-size: 12px; color: var(--color-text-muted); line-height: 1.2; display: none; }
        .header-badge { display: flex; align-items: center; gap: 6px; padding: 4px 10px; background: #ecfdf5; border-radius: 20px; border: 1px solid #d1fae5; }
        .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--color-success); animation: pulse-dot 2s ease-in-out infinite; }
        .badge-text { font-size: 12px; font-weight: 600; color: #059669; letter-spacing: 0.02em; }
        @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @media (min-width: 640px) { .header-tagline { display: block; } }
      `}</style>
    </header>
  );
}
