import CategorySection from "../../components/ui/CategorySection";

interface Category {
  _id: string;
  name: string;
  slug: string;
  bannerImage: string;
}

export default async function CategoryPage() {
  const res = await fetch("https://api.mirexastore.com/api/category", {
    cache: "no-store", // always fetch fresh data (optional: use 'force-cache' for SSG)
  });

  const data = await res.json();
  const categories: Category[] = Array.isArray(data.data) ? data.data : [];

  return <CategorySection categories={categories} />;
}
