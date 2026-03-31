'use client';

import { useState, useEffect } from 'react';
import { EmergencyHero, EmergencyContactList } from "@/components/medical";
import { getEmergencyContacts } from "@/lib/medical-guide";
import type { EmergencyContact } from "@/types/medical";

export default function EmergencyContactsPage() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);

  useEffect(() => {
    getEmergencyContacts().then(setContacts);
  }, []);

  return (
    <div className="page-container">
      <h1 className="sr-only">Emergency Contacts</h1>
      <EmergencyHero />
      <section className="contacts-section">
        <EmergencyContactList contacts={contacts} />
      </section>
      <section className="safety-info">
        <h2>Important Safety Information</h2>
        <div className="info-card">
          <h3>911 in Mexico</h3>
          <p>Emergency services are available by calling 911 from any phone. Response times vary by location.</p>
        </div>
        <div className="info-card">
          <h3>Hyperbaric Chamber</h3>
          <p>Nearest hyperbaric chamber is in La Paz (~200 km south). DAN emergency hotline: <strong>+1-919-684-9111</strong> (24/7).</p>
        </div>
      </section>
      <style jsx>{`
        .page-container { max-width: 900px; margin: 0 auto; padding: var(--sp-4); }
        .contacts-section { margin: var(--sp-8) 0; }
        .safety-info { margin-top: var(--sp-8); padding-top: var(--sp-6); border-top: 2px solid var(--color-sand); }
        .safety-info h2 { font-size: 24px; font-weight: 700; margin-bottom: var(--sp-5); color: var(--color-night); }
        .info-card { background: var(--color-sand-light); border-left: 4px solid var(--color-sun); padding: var(--sp-4); margin-bottom: var(--sp-4); border-radius: var(--radius-sm); }
        .info-card h3 { font-size: 16px; font-weight: 700; margin: 0 0 var(--sp-2) 0; color: var(--color-night); }
        .info-card p { margin: 0; color: var(--color-gray-dark); line-height: 1.6; }
        .info-card strong { color: var(--color-night); }
      `}</style>
    </div>
  );
}
