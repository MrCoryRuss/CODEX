import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Briefing | Posada Underground",
  description: "Listen to the daily audio briefing about weather, wind, water conditions, and community events.",
};

export default function DailyBriefingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
