import Header from "@/app/(commonLayout)/components/shared/Header";
import Footer from "@/app/(commonLayout)/components/shared/Footer";
import type { Metadata } from "next";
import ClickSparkWrapper from "./components/reactbit/ClickSparkWrapper/ClickSparkWrapper";

export const metadata: Metadata = {
  title:
    "MirexaStore | Online Shopping for Everyone – Electronics, Fashion, Home & More",
  description:
    "Shop online at MirexaStore – your all-in-one destination for electronics, fashion, home essentials, gadgets, beauty products, and more. Discover top deals and quality items for men, women, kids, and every age group. Fast delivery, secure checkout, and great prices – everything you need, all in one place.",
  openGraph: {
    title:
      "MirexaStore | Online Shopping for Everyone – Electronics, Fashion, Home & More",
    description:
      "Shop online at MirexaStore – your all-in-one destination for electronics, fashion, home essentials, gadgets, beauty products, and more. Discover top deals and quality items for men, women, kids, and every age group. Fast delivery, secure checkout, and great prices – everything you need, all in one place.",
    url: "https://mirexa-store.vercel.app/",
    siteName: "MirexaStore",
    images: [
      {
        url: "../favicon.ico", // Must be absolute URL
        width: 1200,
        height: 630,
        alt: "MirexaStore – Online Shopping for Everyone",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MirexaStore | Online Shopping for Everyone",
    description:
      "Shop online at MirexaStore – your all-in-one destination for electronics, fashion, home essentials, gadgets, beauty products, and more.",
    images: ["../favicon.ico"],
  },
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <ClickSparkWrapper>
        <header>
          <Header />
        </header>

        <main className="flex-grow pt-[60px]" role="main">
          {children}
        </main>
      </ClickSparkWrapper>
    </div>
  );
}
