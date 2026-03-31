import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Emergency Contacts | Posada Underground",
  description: "Critical emergency contact numbers and services for Posada Concepcion.",
};

export default function EmergencyContactsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
