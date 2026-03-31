'use client';
import { useState } from 'react';
import type { CalendarType } from "@/lib/calendar-subscribe";
import { getGoogleSubscribeUrl, getOutlookSubscribeUrl, getWebcalUrl, getIcsUrl } from "@/lib/calendar-subscribe";
interface Props { calendarType: CalendarType; label?: string; }
export default function SubscribeButtons({ calendarType, label }: Props) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const displayLabel = label ?? (calendarType === "community" ? "Community Events" : "Sports Schedule");
  const handleCopy = async () => { await navigator.clipboard.writeText(getIcsUrl(calendarType)); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="subscribe-wrap">
      <button className="subscribe-trigger" onClick={() => setOpen(!open)}>
        <span className="trigger-text">Subscribe to {displayLabel}</span>
        <span className={`trigger-arrow ${open ? "trigger-arrow--open" : ""}`}>&#x25BE;</span>
      </button>
      {open && (
        <div className="subscribe-menu">
          <a href={getGoogleSubscribeUrl(calendarType)} target="_blank" rel="noopener noreferrer" className="menu-item"><span className="menu-icon">G</span><span className="menu-label">Google Calendar</span></a>
          <a href={getOutlookSubscribeUrl(calendarType)} target="_blank" rel="noopener noreferrer" className="menu-item"><span className="menu-icon">O</span><span className="menu-label">Outlook</span></a>
          <a href={getWebcalUrl(calendarType)} className="menu-item"><span className="menu-icon">&#x1F34E;</span><span className="menu-label">Apple Calendar</span></a>
          <button onClick={handleCopy} className="menu-item menu-item--button"><span className="menu-icon">{copied ? "&#x2713;" : "&#x1F517;"}</span><span className="menu-label">{copied ? "Copied!" : "Copy ICS URL"}</span></button>
        </div>
      )}
      <style jsx>{`
        .subscribe-wrap { position: relative; display: inline-block; }
        .subscribe-trigger { display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: var(--color-primary); color: white; border: none; border-radius: var(--radius-md); font-family: var(--font-body); font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.15s ease; }
        .subscribe-trigger:hover { background: #0052cc; }
        .trigger-arrow { font-size: 12px; transition: transform 0.2s ease; }
        .trigger-arrow--open { transform: rotate(180deg); }
        .subscribe-menu { position: absolute; top: calc(100% + 8px); left: 0; min-width: 220px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); box-shadow: var(--shadow-lg); z-index: 50; overflow: hidden; }
        .menu-item { display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px 16px; font-family: var(--font-body); font-size: 14px; color: var(--color-text); text-decoration: none; border: none; background: none; cursor: pointer; transition: background 0.1s ease; text-align: left; }
        .menu-item:hover { background: var(--color-surface-alt); text-decoration: none; }
        .menu-item + .menu-item { border-top: 1px solid var(--color-border-light); }
        .menu-icon { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: var(--color-primary); background: var(--color-primary-soft); border-radius: 6px; flex-shrink: 0; }
        .menu-label { font-weight: 500; }
      `}</style>
    </div>
  );
}
