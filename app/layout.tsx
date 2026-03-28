import type { Metadata, Viewport } from "next";
import Header from "@/components/layout/header";
import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Posada Underground",
  description:
    "Daily weather, wind, water conditions, events, and community info for Posada Concepcion, Baja California Sur.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1B6B93",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
