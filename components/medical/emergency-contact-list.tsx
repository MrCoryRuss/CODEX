'use client';
import EmergencyContactCard from "./emergency-contact-card";
import type { EmergencyContact } from "@/types/medical";

interface Props {
  contacts: EmergencyContact[];
}

export default function EmergencyContactList({ contacts }: Props) {
  const sortedContacts = [...contacts].sort((a, b) => a.priority - b.priority);

  return (
    <section aria-label="Emergency contacts list">
      <h2 className="section-title">Priority Contacts</h2>

      <div className="contacts-list">
        {sortedContacts.map((contact) => (
          <EmergencyContactCard key={contact.id} contact={contact} />
        ))}
      </div>

      <style jsx>{`
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--color-night);
          margin-bottom: var(--sp-4);
        }

        .contacts-list {
          display: flex;
          flex-direction: column;
          gap: var(--sp-3);
        }
      `}</style>
    </section>
  );
}
