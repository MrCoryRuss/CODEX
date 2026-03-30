'use client';
import Link from "next/link";

export default function PdfViewerPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const pdfId = searchParams.id as string | undefined;
  const pdfTitle = searchParams.title
    ? decodeURIComponent(searchParams.title as string)
    : "Medical Guide";

  return (
    <div className="viewer-container">
      {/* Header with back link */}
      <div className="viewer-header">
        <Link href="/medical-guide" className="back-link">
          ← Back to Medical Guide
        </Link>
        <h1 className="viewer-title">{pdfTitle}</h1>
      </div>

      {/* PDF display area */}
      <div className="pdf-viewport">
        {pdfId ? (
          <>
            {/* Embedded PDF viewer using iframe */}
            <iframe
              src={`/pdfs/${pdfId}.pdf#toolbar=1&navpanes=0&scrollbar=0`}
              className="pdf-frame"
              title={`${pdfTitle} PDF Viewer`}
              aria-label={`PDF viewer for ${pdfTitle}`}
            />

            {/* Fallback download link for unsupported browsers */}
            <noscript>
              <p className="fallback-notice">
                Your browser may not support embedded PDF viewing.{" "}
                <a href={`/pdfs/${pdfId}.pdf`} download>
                  Download the PDF instead
                </a>
                .
              </p>
            </noscript>
          </>
        ) : (
          <div className="no-pdf">
            <p>No PDF selected. Please return to the Medical Guide.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .viewer-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: var(--color-white);
        }

        .viewer-header {
          background: var(--color-sea);
          color: var(--color-white);
          padding: var(--sp-4);
          border-bottom: 2px solid var(--color-sea-dark);
        }

        .back-link {
          display: inline-block;
          margin-bottom: var(--sp-2);
          color: var(--color-sand-light);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .back-link:hover {
          color: var(--color-white);
          text-decoration: underline;
        }

        .viewer-title {
          font-size: 24px;
          font-weight: 700;
          margin: 0;
          color: var(--color-white);
        }

        .pdf-viewport {
          flex: 1;
          overflow: hidden;
          background: var(--color-gray-light);
        }

        .pdf-frame {
          width: 100%;
          height: 100%;
          border: none;
        }

        .no-pdf {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: var(--color-gray);
          font-size: 16px;
        }

        .fallback-notice {
          padding: var(--sp-4);
          background: var(--color-sand-light);
          border-radius: var(--radius-md);
          color: var(--color-night);
          font-size: 14px;
        }

        .fallback-notice a {
          color: var(--color-sea);
          font-weight: 600;
          text-decoration: none;
        }

        .fallback-notice a:hover {
          text-decoration: underline;
        }

        @media (min-width: 640px) {
          .viewer-header {
            padding: var(--sp-5) var(--sp-6);
          }

          .viewer-title {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
}
