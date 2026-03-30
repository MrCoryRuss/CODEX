import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Events | Posada Underground",
  description:
    "Community calendar for Posada Concepcion - social gatherings, markets, services, and medical events.",
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
