"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: "☀️" },
  { href: "/weather", label: "Weather", icon: "🌤" },
  { href: "/events", label: "Events", icon: "📅" },
  { href: "/medical", label: "Medical", icon: "🏥" },
  { href: "/guide", label: "Guide", icon: "💬" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="nav" aria-label="Main navigation">
      <div className="nav-inner">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${active ? "nav-item--active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="nav-label">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <style jsx>{`
        /* Mobile: fixed bottom tab bar */
        .nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: var(--color-white);
          border-top: 1px solid rgba(26, 26, 46, 0.08);
          box-shadow: 0 -2px 8px rgba(26, 26, 46, 0.06);
        }

        .nav-inner {
          display: flex;
          justify-content: space-around;
          align-items: center;
          max-width: var(--max-width);
          margin: 0 auto;
          height: var(--nav-height);
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: var(--sp-1) var(--sp-2);
          min-width: 44px;
          min-height: 44px;
          justify-content: center;
          border-radius: var(--radius-sm);
          color: var(--color-desert);
          text-decoration: none;
          transition: color 0.12s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .nav-item:hover {
          color: var(--color-sea);
          text-decoration: none;
        }

        .nav-item--active {
          color: var(--color-sea);
        }

        .nav-icon {
          font-size: 20px;
          line-height: 1;
        }

        .nav-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        /* Desktop: horizontal bar below header */
        @media (min-width: 640px) {
          .nav {
            position: sticky;
            top: var(--header-height);
            bottom: auto;
            border-top: none;
            border-bottom: 1px solid rgba(26, 26, 46, 0.08);
            box-shadow: 0 2px 8px rgba(26, 26, 46, 0.04);
          }

          .nav-inner {
            justify-content: flex-start;
            gap: var(--sp-1);
            padding: 0 var(--sp-4);
            height: 48px;
          }

          .nav-item {
            flex-direction: row;
            gap: var(--sp-2);
            padding: var(--sp-2) var(--sp-3);
            border-radius: var(--radius-sm);
          }

          .nav-item--active {
            background: var(--color-sea-faint);
          }

          .nav-icon {
            font-size: 16px;
          }

          .nav-label {
            font-size: 14px;
          }
        }
      `}</style>
    </nav>
  );
}
