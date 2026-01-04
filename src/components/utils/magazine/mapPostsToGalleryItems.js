// src/components/utils/magazine/mapPostsToGalleryItems.js

/**
 * Convert blog posts to GalleryGrid items.
 * - Strips HTML (CKEditor) before truncation
 * - Handles null/undefined safely
 * - Produces consistent fields for GalleryGrid
 */

export function mapPostsToGalleryItems(posts = [], options = {}) {
  const {
    locale = null,
    descriptionLimit = 100,
    ctaText = "مشاهده",
    basePath = "magazine",
  } = options;

  const stripHtml = (html) => (html || "").replace(/<[^>]*>/g, "");
  const truncate = (text, limit) => {
    const s = (text || "").trim();
    if (!limit || s.length <= limit) return s;
    return `${s.slice(0, limit)}…`;
  };

  // Normalize base href (supports /fa/magazine/... or /magazine/...)
  const makeHref = (slug) => {
    const safeSlug = slug || "";
    const prefix = locale ? `/${locale}` : "";
    return `${prefix}/${basePath}/${safeSlug}`;
  };

  return (posts || []).map((post) => {
    const contentPlain = stripHtml(post?.content);
    const summaryPlain = stripHtml(post?.summary);

    // Prefer summary (if exists), otherwise fallback to content
    const descriptionSource = summaryPlain || contentPlain;

    return {
      mediaType: post?.file ? "video" : "image",
      mediaSrc: post?.file || post?.media || "",
      title: post?.title || "",
      description: truncate(descriptionSource, descriptionLimit),
      ctaText,
      ctaHref: makeHref(post?.slug),
    };
  });
}

