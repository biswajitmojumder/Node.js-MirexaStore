// src/app/(commonLayout)/store/[slug]/page.tsx

import { notFound } from "next/navigation";
import { Metadata } from "next";
import StorePageClient from "../../components/ui/StorePageClient";

// Define the types for Brand and ResellerProfile
interface Brand {
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  logo?: string;
  banner?: string;
  location?: string;
  verified?: boolean;
  joinedAt?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
  };
}

interface ResellerProfile {
  _id: string;
  userEmail: string;
  brand: Brand;
}

// ✅ Create a proper PageProps interface
interface PageProps {
  params: Promise<{ slug: string }>; // params is a Promise, so you need to await it
}

// ✅ Helper function to fetch reseller data by slug
async function getResellerBySlug(
  slug: string
): Promise<ResellerProfile | null> {
  try {
    const res = await fetch(
      `https://campus-needs-backend.vercel.app/api/reseller/slug/${slug}`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;

    const json = await res.json();
    return json?.data || null;
  } catch (error) {
    console.error("Error fetching reseller:", error);
    return null;
  }
}

// ✅ Metadata generation for the store page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>; // params is a Promise that needs to be awaited
}): Promise<Metadata> {
  // Await the params to get the slug
  const { slug } = await params;

  const reseller = await getResellerBySlug(slug);

  if (!reseller) {
    return {
      title: "Store Not Found - MirexaStore",
      description:
        "The store you're looking for does not exist or is currently unavailable.",
    };
  }

  const { name, description, logo, socialLinks } = reseller.brand;

  return {
    title: `${name} Store | MirexaStore`,
    description:
      description?.slice(0, 160) || "Explore products from this store.",
    openGraph: {
      title: `${name} Store`,
      description: description,
      images: [
        {
          url: logo || "/default-logo.png", // Fallback to default logo if no logo is available
          width: 800,
          height: 600,
          alt: `${name} Store Logo`,
        },
      ],
    },
  };
}

// Main Store Page Component
export default async function StorePage({ params }: PageProps) {
  // Await params to get the slug
  const { slug } = await params;

  const reseller = await getResellerBySlug(slug);

  if (!reseller) return notFound(); // Redirect to notFound page if reseller is not found

  return <StorePageClient reseller={reseller} />;
}
