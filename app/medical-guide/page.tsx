'use client';

import { useState, useEffect } from 'react';
import { MedicalGuideHero, TownGrid, CategoryGrid, PdfViewerCard } from "@/components/medical";
import { getMedicalTowns, getMedicalCategories, getMedicalPDFs } from "@/lib/medical-guide";
import type { MedicalTown, MedicalCategory, MedicalGuidePDF } from "@/types/medical";

export default function MedicalGuidePage() {
  const [towns, setTowns] = useState<MedicalTown[]>([]);
  const [categories, setCategories] = useState<MedicalCategory[]>([]);
  const [pdfs, setPdfs] = useState<MedicalGuidePDF[]>([]);

  useEffect(() => {
    Promise.all([getMedicalTowns(), getMedicalCategories(), getMedicalPDFs()]).then(([t, c, p]) => {
      setTowns(t);
      setCategories(c);
      setPdfs(p);
    });
  }, []);

  return (
    <div className="page-container">
      <h1 className="sr-only">Medical Guide</h1>
      <MedicalGuideHero />
      <section className="guide-section">
        <h2 className="section-title">Medical Facilities by Location</h2>
        <TownGrid towns={towns} />
      </section>
      <section className="guide-section">
        <h2 className="section-title">Services &amp; Resources</h2>
        <CategoryGrid categories={categories} />
      </section>
      {pdfs.length > 0 && (
        <section className="guide-section">
          <h2 className="section-title">Reference Materials</h2>
          <div className="pdf-grid">
            {pdfs.map((pdf) => (<PdfViewerCard key={pdf.id} pdf={pdf} />))}
          </div>
        </section>
      )}
      <style jsx>{`
        .page-container { max-width: 1200px; margin: 0 auto; padding: var(--sp-4); }
        .guide-section { margin-bottom: var(--sp-8); }
        .section-title { font-size: 24px; font-weight: 700; margin-bottom: var(--sp-5); color: var(--color-night); }
        .pdf-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--sp-4); }
        @media (min-width: 640px) { .page-container { padding: var(--sp-6); } .section-title { font-size: 28px; } }
      `}</style>
    </div>
  );
}
