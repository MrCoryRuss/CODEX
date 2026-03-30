import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Weather & Wind | Posada Underground",
  description:
    "Detailed weather forecast, wind conditions, and UV index for Posada Concepcion, Bahia Concepcion, BCS.",
};

export default function WeatherLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
