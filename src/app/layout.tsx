import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Footer from "@/app/(commonLayout)/components/shared/Footer";
import Providers from "./lib/Providers";
import Script from "next/script"; // ✅ import Script for GA4

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MireXaStore",
  description:
    "Welcome to e_commerce_web_application – where innovation meets imagination in the dynamic realm of technology, offering a thrilling journey through the latest trends and groundbreaking discoveries in the world of tech!",
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
        <div className="min-h-screen">
          <Providers>{children}</Providers>
        </div>
        <Footer />
      </body>
    </html>
  );
}
