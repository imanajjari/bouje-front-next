// utils/transformBlogPost.js

export function transformBlogPost(post, locale) {
  // پاک کردن تگ‌های HTML و ساختن excerpt
  const plain = post.content?.replace(/<[^>]+>/g, "") ?? "";
  const excerpt = plain.split(" ").slice(0, 30).join(" ") + "…";

  // محاسبه زمان مطالعه
  const words = plain.trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(words / 200));

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt,
    summary: post.summary ?? excerpt,
    content: post.content,
    featuredImage: post.media,
    video: post.file || "",
    videoAparat: post.aparatUrl || "",
    featuredLevel: post.featured_level ?? 0,
    sortOrder: post.sort_order ?? 0,

    // دسته‌بندی اصلی، اگر باشد
    categories: post.categories?.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      isVisible: cat.is_visible,
      isMaster: cat.is_master,
      totalViews: cat.total_views,
    })) ?? [],

    // دسته اصلی برای نمایش سریع
    mainCategory: post.categories?.[0]?.name ?? null,

    tags: post.tags ?? [],
    author: {
      name: "Site Editor", // تا وقتی فیلد واقعی author نداشته باشی
    },
    publishedAt: post.created_at,
    updatedAt: post.updated_at,
    readingTime,
    views: post.views ?? 0,
    likes: 0,
    shares: 0,

    relatedArticles: (post.related_posts ?? []).map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      image: p.media,
      category: p.tags?.[0] ?? "General",
      featuredLevel: p.featured_level ?? 0,
      views: p.views ?? 0,
      createdAt: p.created_at,
    })),
  };
}
