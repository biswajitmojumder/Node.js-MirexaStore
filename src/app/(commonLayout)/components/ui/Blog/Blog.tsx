"use client";

const Blog = () => {
  const blogPosts = [
    {
      title: "How to Choose the Best Electronics for Your Home",
      date: "March 12, 2025",
      excerpt:
        "Choosing the right electronics for your home can be a challenge. Here are some tips on how to make an informed decision when purchasing electronics...",
      link: "/blog/how-to-choose-electronics",
    },
    {
      title: "Top 5 Fashion Trends in 2025",
      date: "February 20, 2025",
      excerpt:
        "2025 is bringing in some exciting new fashion trends. From vintage looks to cutting-edge designs, here’s what you should expect in fashion this year...",
      link: "/blog/top-fashion-trends-2025",
    },
    {
      title: "The Importance of Sustainable Shopping",
      date: "January 5, 2025",
      excerpt:
        "Sustainability is key in today’s shopping landscape. Learn about why shopping sustainably is important and how you can contribute to a better environment...",
      link: "/blog/sustainable-shopping",
    },
  ];

  return (
    <section className="bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Blog / ব্লগ
        </h1>

        <div className="space-y-12">
          {blogPosts.map((post, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-2xl transition-all"
            >
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                {post.title}
              </h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <p className="text-sm text-gray-500 mb-4">
                Published on {post.date}
              </p>
              <a href={post.link} className="text-blue-600 hover:underline">
                Read More
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
