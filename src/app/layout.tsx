import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Myanmar Trading | Logistics Overview", template: "%s | Myanmar Trading" },
  description: "Real-Time Logistics Monitoring for Myanmar Trading — AI Engineering Assignment 5. Logistics dashboard with secure role-based access.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
