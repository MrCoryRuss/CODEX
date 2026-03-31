'use client';
interface MedicalCategory {
  id: string;
  label: string;
  icon: string;
  count: number;
}

interface Props {
  categories: MedicalCategory[];
}

export default function CategoryGrid({ categories }: Props) {
  return (
    <section aria-label="Medical facility categories">
      <h2 className="section-title">Services Available</h2>

      <div className="categories-grid">
        {categories.map((category) => (
          <button
            key={category.id}
            className="category-card card"
            aria-label={`${category.label}: ${category.count} facilities`}
          >
            <div className="category-icon" aria-hidden="true">
              {category.icon}
            </div>
            <h3 className="category-label">{category.label}</h3>
            <span className="category-count">{category.count}</span>
            <span className="category-sublabel">facilities</span>
          </button>
        ))}
      </div>

      <style jsx>{`
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--color-night);
          margin-bottom: var(--sp-4);
        }

        .categories-grid {
          display: grid;
          gap: var(--sp-3);
          grid-template-columns: repeat(2, 1fr);
        }

        @media (min-width: 640px) {
          .categories-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .categories-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .category-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--sp-2);
          padding: var(--sp-5) var(--sp-3);
          border: none;
          background: var(--color-white);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-card);
          transition: all 0.15s ease;
          cursor: pointer;
        }

        .category-card:hover {
          box-shadow: var(--shadow-card-hover);
          transform: translateY(-2px);
        }

        .category-card:active {
          transform: translateY(0);
        }

        .category-icon {
          font-size: 32px;
          line-height: 1;
        }

        .category-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-night);
          text-align: center;
        }

        .category-count {
          font-family: var(--font-data);
          font-size: 24px;
          font-weight: 500;
          color: var(--color-sea);
        }

        .category-sublabel {
          font-size: 12px;
          color: var(--color-desert);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
      `}</style>
    </section>
  );
}

