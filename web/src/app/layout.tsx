import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { useBootstrap } from "../hooks/useBootstrap";
import i18n from "../i18n"; // Import i18n

export const metadata: Metadata = {
  title: "Desketo Web",
  description: "Virtual Desktop Service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useBootstrap(); // Load Bootstrap JS
  return (
    <html lang={i18n.language}>
      <body>{children}</body>
    </html>
  );
}