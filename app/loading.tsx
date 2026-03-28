export default function Loading() {
  return (
    <div className="page-container">
      {/* Quick stats skeleton */}
      <div className="skeleton-stats">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton-pill" />
        ))}
      </div>

      {/* Card grid skeleton */}
      <div className="dashboard-grid">
        <div className="grid-span-full">
          <div className="skeleton-card skeleton-card--hero" />
        </div>
        <div className="grid-span-wide">
          <div className="skeleton-card skeleton-card--map" />
        </div>
        <div className="grid-span-narrow">
          <div className="skeleton-card skeleton-card--tall" />
        </div>
        <div className="skeleton-card skeleton-card--medium" />
        <div className="skeleton-card skeleton-card--medium" />
        <div className="skeleton-card skeleton-card--short" />
        <div className="skeleton-card skeleton-card--short" />
      </div>

      <style>{`
        .skeleton-stats {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .skeleton-pill {
          flex: 1;
          height: 64px;
          background: var(--color-white);
          border-radius: var(--radius-md);
          animation: skeleton-pulse 1.5s ease-in-out infinite;
        }

        .skeleton-card {
          background: var(--color-white);
          border-radius: var(--radius-md);
          animation: skeleton-pulse 1.5s ease-in-out infinite;
        }

        .skeleton-card--hero {
          height: 120px;
        }

        .skeleton-card--map {
          height: 200px;
        }

        .skeleton-card--tall {
          height: 200px;
        }

        .skeleton-card--medium {
          height: 280px;
        }

        .skeleton-card--short {
          height: 180px;
        }

        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
