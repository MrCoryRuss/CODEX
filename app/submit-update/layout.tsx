import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit an Update | Posada Underground",
  description: "Share community news, events, or corrections.",
};

export default function SubmitUpdateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
