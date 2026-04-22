"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const NAV_ITEMS = [
  { href: "/",              label: "Home",     icon: "&#x2600;&#xFE0F;" },
  { href: "/water",         label: "Water",    icon: "&#x1F30A;" },
  { href: "/events",        label: "Events",   icon: "&#x1F4C5;" },
  { href: "/daily-briefing",label: "Briefing", icon: "&#x1F399;" },
  { href: "/medical",       label: "Medical",  icon: "&#x1F3E5;" },
];
export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="nav" aria-label="Main navigation">
      <div className="nav-inner">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`nav-item ${active ? "nav-item--active" : ""}`} aria-current={active ? "page" : undefined}>
              <span className="nav-icon" aria-hidden="true" dangerouslySetInnerHTML={{ __html: item.icon }} />
              <span className="nav-label">{item.label}</span>
            </Link>
          );
        })}
      </div>
      <style jsx>{`
        .nav {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
          background: rgba(44,24,16,0.97);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border-top: 1px solid rgba(212,196,160,0.15);
        }
        .nav-inner {
          display: flex; justify-content: space-around; align-items: center;
          max-width: var(--max-width); margin: 0 auto; height: var(--nav-height);
        }
        .nav-item {
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          padding: var(--sp-2); min-width: 48px; min-height: 48px; justify-content: center;
          border-radius: var(--radius-md);
          color: #9E7B5E;
          text-decoration: none;
          transition: color 0.15s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .nav-item:hover { color: #F2EAD8; text-decoration: none; }
        .nav-item--active { color: #C45C2A; }
        .nav-icon { font-size: 22px; line-height: 1; }
        .nav-label { font-size: 11px; font-weight: 600; letter-spacing: 0.01em; }
        @media (min-width: 640px) {
          .nav {
            position: sticky; top: var(--header-height); bottom: auto;
            border-top: none; border-bottom: 1px solid rgba(212,196,160,0.2);
            background: #2C1810;
          }
          .nav-inner { justify-content: flex-start; gap: var(--sp-1); padding: 0 var(--sp-4); height: 48px; }
          .nav-item { flex-direction: row; gap: var(--sp-2); padding: var(--sp-2) var(--sp-3); }
          .nav-item--active { background: rgba(196,92,42,0.18); color: #C45C2A; }
          .nav-icon { font-size: 16px; }
          .nav-label { font-size: 14px; }
        }
      `}</style>
    </nav>
  );
}
