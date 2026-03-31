import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Viewer | Posada Underground",
  description: "Medical guide PDF viewer",
};

export default function PdfViewerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
