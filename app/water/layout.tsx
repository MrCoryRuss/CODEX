import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Water & Marine | Posada Underground",
  description:
    "Marine conditions, tide schedule, swell, sea temperature, and moon phase for Bahia Concepcion.",
};

export default function WaterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
