"use client";

import Link from "next/link";

const LINKS = [
  { href: "/water",          label: "Water",    icon: "🌊" },
  { href: "/events",         label: "Events",   icon: "📅" },
  { href: "/medical",        label: "Medical",  icon: "🏥" },
  { href: "/daily-briefing", label: "Briefing", icon: "🎙️" },
  { href: "/sports",         label: "Sports",   icon: "🏐" },
];

export default function QuickLinks() {
  return (
    <div className="quick-links" aria-label="Quick navigation">
      {LINKS.map(l => (
        <Link key={l.href} href={l.href} className="ql-chip">
          <span aria-hidden="true">{l.icon}</span>
          <span>{l.label}</span>
        </Link>
      ))}
      <style jsx>{`
        .quick-links {
          display: flex;
          gap: var(--sp-2);
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding-bottom: var(--sp-1);
          margin-bottom: var(--sp-4);
        }
        .quick-links::-webkit-scrollbar { display: none; }
        .ql-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 24px;
          border: 1px solid var(--color-border);
          background: var(--color-surface);
          color: var(--color-text);
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          white-space: nowrap;
          flex-shrink: 0;
          transition: background 0.15s, border-color 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .ql-chip:hover {
          background: var(--color-sea-faint);
          border-color: var(--color-sea);
          text-decoration: none;
          color: var(--color-sea);
        }
      `}</style>
    </div>
  );
}
