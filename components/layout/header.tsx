"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="header-brand">
          <span className="header-logo" aria-hidden="true">🌊</span>
          <span className="header-title">Posada Underground</span>
        </Link>
        <span className="header-tagline">Bahía Concepción, BCS</span>
      </div>

      <style jsx>{`
        .header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--color-sea);
          color: var(--color-white);
          height: var(--header-height);
          display: flex;
          align-items: center;
        }

        .header-inner {
          width: 100%;
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 0 var(--sp-4);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: var(--sp-2);
          color: var(--color-white);
          text-decoration: none;
        }

        .header-brand:hover {
          text-decoration: none;
          opacity: 0.9;
        }

        .header-logo {
          font-size: 22px;
          line-height: 1;
        }

        .header-title {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .header-tagline {
          font-size: 13px;
          opacity: 0.75;
          display: none;
        }

        @media (min-width: 640px) {
          .header-tagline {
            display: block;
          }
        }
      `}</style>
    </header>
  );
}
