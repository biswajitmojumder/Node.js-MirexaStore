import { notFound } from "next/navigation";
import Image from "next/image";
import { blogs } from "../blogData";

type Props = {
  params: { id: string };
};

const BlogDetailsPage = ({ params }: Props) => {
  const blog = blogs.find((b) => b.slug === params.id);

  if (!blog) return notFound();

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 min-h-screen bg-white shadow-lg rounded-lg">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
        {blog.title}
      </h1>

      <div className="relative w-full h-80 mb-10 rounded-lg overflow-hidden shadow-md">
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          style={{ objectFit: "cover" }}
          priority
          sizes="(max-width: 768px) 100vw,
                 (max-width: 1200px) 80vw,
                 800px"
        />
      </div>

      <article
        className="prose prose-orange max-w-none prose-lg"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Optional: Add a back button or navigation */}
      <div className="mt-12">
        <a
          href="/blog"
          className="inline-block text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-200"
        >
          ← Back to all posts
        </a>
      </div>
    </div>
  );
};

export default BlogDetailsPage;
