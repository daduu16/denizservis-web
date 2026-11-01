import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { siteConfig } from "@/config/site";
import { indexableDeployment } from "@/config/seo";
import { pageMetadata } from "@/lib/seo";
import { AnalyticsGate } from "@/components/AnalyticsGate";
import { analyticsId } from "@/lib/analytics";
import { LanguageProvider, T } from "@/components/LanguageProvider";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin", "cyrillic"], display: "swap", variable: "--font-manrope" });

export const metadata: Metadata = {
  ...pageMetadata("/"),
  metadataBase: new URL(siteConfig.url),
  title: { default: "Paltaryuyan və Qabyuyan Təmiri | DənizServis", template: "%s | DənizServis" },
  robots: { index: indexableDeployment, follow: true },
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0B2851" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="az" className={manrope.variable} data-scroll-behavior="smooth">
      <body>
        <LanguageProvider>
        <a className="skip-link" href="#main-content"><T>Əsas məzmuna keç</T></a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <WhatsAppButton />
        {analyticsId && <AnalyticsGate />}
        </LanguageProvider>
      </body>
    </html>
  );
}
