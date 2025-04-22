import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Footer from "@/app/(commonLayout)/components/shared/Footer";
import Providers from "./lib/Providers";
import Script from "next/script";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CampusNeeds",
  description:
    "Welcome to CampusNeeds – your trusted platform for essential student products. From gadgets to gear, find everything you need to thrive in school, college, or university life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <head>
        {/* ✅ Google Analytics 4 Tracking Script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RWY5TMX717"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RWY5TMX717');
          `}
        </Script>
      </head>
      <body className={roboto.className}>
        <Providers>
          <div className="min-h-screen">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
