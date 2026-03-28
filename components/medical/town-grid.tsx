import type { MedicalTown } from "@/types/medical";

interface Props {
  towns: MedicalTown[];
}

export default function TownGrid({ towns }: Props) {
  return (
    <section aria-label="Towns with medical services">
      <h2 className="section-title">Nearby Towns & Services</h2>

      <div className="towns-grid">
        {towns.map((town) => (
          <div key={town.id} className="town-card card">
            <div className="town-header">
              <h3 className="town-name">{town.name}</h3>
              <span className="town-distance">{town.distanceKm} km</span>
            </div>

            <div className="town-details">
              <div className="detail-row">
                <span className="detail-label">Drive Time</span>
                <span className="detail-value">{town.driveTimeMin} min</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Phone</span>
                <a href={`tel:${town.phone}`} className="detail-phone">
                  {town.phone}
                </a>
              </div>

              {town.whatsappPhone && (
                <div className="detail-row">
                  <span className="detail-label">WhatsApp</span>
                  <a href={`https://wa.me/${town.whatsappPhone.replace(/\D/g, '')}`} className="detail-whatsapp">
                    💬 Message
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--color-night);
          margin-bottom: var(--sp-4);
        }

        .towns-grid {
          display: grid;
          gap: var(--sp-3);
          grid-template-columns: 1fr;
        }

        @media (min-width: 640px) {
          .towns-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .town-card {
          display: flex;
          flex-direction: column;
          gap: var(--sp-3);
        }

        .town-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: var(--sp-2);
        }

        .town-name {
          font-size: 16px;
          font-weight: 600;
          color: var(--color-night);
        }

        .town-distance {
          font-family: var(--font-data);
          font-size: 14px;
          font-weight: 500;
          color: var(--color-sea);
          white-space: nowrap;
        }

        .town-details {
          display: flex;
          flex-direction: column;
          gap: var(--sp-2);
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--sp-2) 0;
          border-bottom: 1px solid var(--color-sand);
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-label {
          font-size: 13px;
          font-weight: 500;
          color: var(--color-desert);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .detail-value {
          font-family: var(--font-data);
          font-size: 14px;
          font-weight: 500;
          color: var(--color-night);
        }

        .detail-phone {
          font-family: var(--font-data);
          font-size: 14px;
          font-weight: 500;
          color: var(--color-sea);
          text-decoration: none;
        }

        .detail-phone:hover {
          text-decoration: underline;
        }

        .detail-whatsapp {
          font-size: 13px;
          font-weight: 500;
          color: var(--color-sea);
          text-decoration: none;
        }

        .detail-whatsapp:hover {
          text-decoration: underline;
        }
      `}</style>
    </section>
  );
}
