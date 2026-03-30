import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ask the Medical Guide | Posada Underground",
  description: "Chat with the AI-powered Posada Medical Guide assistant.",
};

export default function AskMedicalGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
