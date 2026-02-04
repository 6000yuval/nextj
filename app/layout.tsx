import type { Metadata } from "next";

import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import { SITE_DESCRIPTION, SITE_NAME, getSiteUrl, canonicalOrPath } from "@/lib/site";

import "./globals.css";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: baseUrl ? new URL(baseUrl) : null,
  title: {
    template: `%s | ${SITE_NAME}`,
    default: SITE_NAME,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: canonicalOrPath("/"),
  },
  openGraph: {
    type: "website",
    locale: "he_IL",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-screen bg-sand-50 text-ink-900">
        <div className="flex min-h-screen flex-col">
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}