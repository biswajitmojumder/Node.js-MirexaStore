import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Footer from "@/app/(commonLayout)/components/shared/Footer";
import Providers from "./lib/Providers";
import Script from "next/script";
import ClickSparkWrapper from "./(commonLayout)/components/reactbit/ClickSparkWrapper/ClickSparkWrapper";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MirexaStore",
  description:
    "Welcome to MirexaStore – your trusted platform for essential student products. From gadgets to gear, find everything you need to thrive in school, college, or university life.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light">
      <head>
        {/* Viewport and theme color meta */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#F85606" />

        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Preconnect GA domain to speed up loading */}
        <link
          rel="preconnect"
          href="https://www.googletagmanager.com"
          crossOrigin="anonymous"
        />

        {/* Google Analytics 4 - load lazily after main content */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RWY5TMX717"
          strategy="lazyOnload"
        />
        <Script id="ga4-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RWY5TMX717');
          `}
        </Script>
      </head>
      <body className={roboto.className}>
        <ClickSparkWrapper>
          <Providers>
            {children}
            <Footer />
          </Providers>
        </ClickSparkWrapper>
      </body>
    </html>
  );
}
