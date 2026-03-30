import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medical Guide | Posada Underground",
  description: "Emergency contacts, medical facilities, and health resources for Posada Concepcion.",
};

export default function MedicalGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
