import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Header from "../components/Header";
import ClientWrapper from "../components/ClientWrapper";
import I18nProvider from "../components/I18nProvider";

export const metadata: Metadata = {
  title: "Desketo Web",
  description: "Virtual Desktop Service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"><head>
        {/* TODO: Add Velzon's CSS once assets are copied to public/assets/css/ */}
        {/* <link rel="stylesheet" href="/assets/css/style.css" /> */}
      </head><body>
        <ClientWrapper>
          <I18nProvider>
            <Header />
            <main>{children}</main>
          </I18nProvider>
        </ClientWrapper>
      </body></html>
  );
}