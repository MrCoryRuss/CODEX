import { EmergencyHero, EmergencyContactList } from "@/components/medical";
import { getEmergencyContacts } from "@/lib/medical-guide";

// ISR: Revalidate every 24 hours (emergency contacts rarely change)
export const revalidate = 86400;

export const metadata = {
  title: "Emergency Contacts | Posada Underground",
  description:
    "Critical emergency contact numbers and services for Posada Concepción.",
};

export default async function EmergencyContactsPage() {
  const contacts = await getEmergencyContacts();

  return (
    <div className="page-container">
      <h1 className="sr-only">Emergency Contacts</h1>

      {/* Hero with critical info */}
      <EmergencyHero />

      {/* Emergency contacts list */}
      <section className="contacts-section">
        <EmergencyContactList contacts={contacts} />
      </section>

      {/* Additional safety info */}
      <section className="safety-info">
        <h2>Important Safety Information</h2>

        <div className="info-card">
          <h3>911 in Mexico</h3>
          <p>
            Emergency services (ambulance, fire, police) are available by
            calling 911 from any phone. Response times vary by location;
            Posada Concepción is remote, so prepare for delays.
          </p>
        </div>

        <div className="info-card">
          <h3>Hyperbaric Chamber</h3>
          <p>
            The nearest hyperbaric chamber for diving emergencies is located in
            La Paz (Baja California Sur), approximately 200 km south. For DAN
            member evacuation assistance, contact DAN emergency hotline:{" "}
            <strong>+1-919-684-9111</strong> (available 24/7 from anywhere).
          </p>
        </div>

        <div className="info-card">
          <h3>Common Environmental Hazards</h3>
          <ul>
            <li>
              <strong>Scorpion stings:</strong> Remove visible stinger with
              tweezers, apply ice, take ibuprofen. Seek medical help for severe
              reactions.
            </li>
            <li>
              <strong>Jellyfish/sea urchins:</strong> Rinse with vinegar if
              available, remove spines carefully, soak in hot water (110–113°F)
              for 20-45 minutes.
            </li>
            <li>
              <strong>Heat exhaustion:</strong> Move to shade, drink water,
              apply cold compresses. Seek medical attention if symptoms persist.
            </li>
          </ul>
        </div>

        <div className="info-card">
          <h3>Medication Availability</h3>
          <p>
            Common medications (painkillers, antibiotics, antihistamines) are
            available at pharmacies in Posada and Loreto. No prescription
            required for many medications sold in Mexico. Bring a supply of
            specialized medications you depend on.
          </p>
        </div>
      </section>

      <style jsx>{`
        .page-container {
          max-width: 900px;
          margin: 0 auto;
          padding: var(--sp-4);
        }

        .contacts-section {
          margin: var(--sp-8) 0;
        }

        .safety-info {
          margin-top: var(--sp-8);
          padding-top: var(--sp-6);
          border-top: 2px solid var(--color-sand);
        }

        .safety-info h2 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: var(--sp-5);
          color: var(--color-night);
        }

        .info-card {
          background: var(--color-sand-light);
          border-left: 4px solid var(--color-sun);
          padding: var(--sp-4);
          margin-bottom: var(--sp-4);
          border-radius: var(--radius-sm);
        }

        .info-card h3 {
          font-size: 16px;
          font-weight: 700;
          margin: 0 0 var(--sp-2) 0;
          color: var(--color-night);
        }

        .info-card p {
          margin: 0 0 var(--sp-2) 0;
          color: var(--color-gray-dark);
          line-height: 1.6;
        }

        .info-card ul {
          margin: var(--sp-2) 0 0 0;
          padding-left: var(--sp-5);
          color: var(--color-gray-dark);
          line-height: 1.6;
        }

        .info-card li {
          margin-bottom: var(--sp-2);
        }

        .info-card strong {
          color: var(--color-night);
        }

        @media (min-width: 640px) {
          .page-container {
            padding: var(--sp-6);
          }

          .safety-info h2 {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
}
