// utils/transformBlogPost.js




export function transformBlogPost(
  post,
  locale
) {
  // محاسبهٔ خلاصهٔ ۱۵۰ کلمه‌ای
  const plain = post.content.replace(/<[^>]+>/g, "");
  const excerpt = plain.split(" ").slice(0, 30).join(" ") + "…";

  // محاسبهٔ زمان مطالعه (۲۰۰ کلمه در دقیقه)
  const words = plain.trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(words / 200));

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt,
    content: post.content,
    featuredImage: post.media,
    gallery: [], // اگر API گالری برگرداند، اینجا قرار دهید
    video: post.file, // در صورت نیاز
    category: post.tags?.[0] ?? "Uncategorized",
    tags: post.tags,
    author: {
      name: "Site Editor", // تا وقتی فیلد author در API نباشد
    },
    publishedAt: post.created_at,
    updatedAt: post.updated_at,
    readingTime,
    likes: 0, // اگر فیلدی ندارید، صفر بگذارید
    shares: 0,
    relatedArticles: post.related_posts.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      image: p.media,
      category: p.tags?.[0] ?? "General",
    })),
  };
}
