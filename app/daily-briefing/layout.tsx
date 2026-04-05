import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Briefing | Posada Underground",
  description: "KM112 morning broadcast — weather, tides, fishing report, and 3-day outlook for Bahía Concepción. Updated daily at 1 AM.",
};

export default function DailyBriefingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
