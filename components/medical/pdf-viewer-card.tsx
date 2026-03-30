'use client';
import Link from "next/link";
import type { MedicalGuidePDF } from "@/types/medical";

interface Props {
  pdf: MedicalGuidePDF;
}

export default function PDFViewerCard({ pdf }: Props) {
  const lastUpdatedDate = new Date(pdf.lastUpdated);
  const formattedDate = lastUpdatedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link href={pdf.url} target="_blank" rel="noopener noreferrer" className="card-link">
      <div className="pdf-card card">
        <div className="card-header">
          <span className="card-icon card-icon--sea" aria-hidden="true">📄</span>
          <div className="pdf-header-text">
            <span className="card-title">{pdf.category.toUpperCase()}</span>
            <h3 className="pdf-title">{pdf.title}</h3>
          </div>
        </div>

        <div className="pdf-meta">
          <div className="meta-item">
            <span className="meta-label">Pages</span>
            <span className="meta-value">{pdf.pageCount}</span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Updated</span>
            <span className="meta-value">{formattedDate}</span>
          </div>
        </div>

        {pdf.description && (
          <p className="pdf-description">{pdf.description}</p>
        )}

        <div className="pdf-cta">
          <span className="cta-text">View PDF</span>
          <span className="cta-icon" aria-hidden="true">→</span>
        </div>

        <style jsx>{`
          .pdf-card {
            display: flex;
            flex-direction: column;
            gap: var(--sp-3);
          }

          .card-header {
            flex-direction: column;
            gap: var(--sp-2);
            align-items: flex-start;
          }

          .pdf-header-text {
            display: flex;
            flex-direction: column;
            gap: var(--sp-1);
          }

          .pdf-title {
            font-size: 15px;
            font-weight: 600;
            color: var(--color-night);
          }

          .pdf-meta {
            display: flex;
            gap: var(--sp-4);
            padding: var(--sp-2) 0;
            border-top: 1px solid var(--color-sand);
            border-bottom: 1px solid var(--color-sand);
          }

          .meta-item {
            display: flex;
            flex-direction: column;
            gap: var(--sp-1);
          }

          .meta-label {
            font-size: 11px;
            font-weight: 600;
            color: var(--color-desert);
            text-transform: uppercase;
            letter-spacing: 0.03em;
          }

          .meta-value {
            font-family: var(--font-data);
            font-size: 14px;
            font-weight: 500;
            color: var(--color-night);
          }

          .pdf-description {
            font-size: 14px;
            color: var(--color-desert);
            line-height: 1.5;
          }

          .pdf-cta {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-top: var(--sp-2);
            color: var(--color-sea);
            font-weight: 600;
          }

          .cta-text {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }

          .cta-icon {
            font-size: 16px;
          }

          .pdf-card:hover .cta-icon {
            transform: translateX(4px);
            transition: transform 0.2s ease;
          }
        `}</style>
      </div>
    </Link>
  );
}
