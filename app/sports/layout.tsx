import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sports & Activities | Posada Underground",
  description:
    "Daily sports schedule and community activities in Posada Concepcion - pickleball, yoga, volleyball, and more.",
};

export default function SportsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
