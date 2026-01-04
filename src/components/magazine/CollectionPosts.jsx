'use client';

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

/**
 * CollectionPosts
 * - Renders a grid of magazine posts.
 * - Supports RTL/LTR via `collection.direction`.
 * - Safely renders CKEditor/RichText summaries as plain text preview (no HTML tags).
 */
export default function CollectionPosts({
  collection,
  summaryLimit = 120,
  cols = { base: 1, sm: 2, lg: 3 },
}) {
  const posts = collection?.posts ?? [];
  const direction = collection?.direction ?? "rtl";
  const title = collection?.title;

  const gridClasses = `grid gap-6 grid-cols-${cols.base} ${
    cols.sm ? `sm:grid-cols-${cols.sm}` : ""
  } ${cols.lg ? `lg:grid-cols-${cols.lg}` : ""}`;

  // Helper: strip HTML tags for preview text
  const toPlainText = (html) => (html || "").replace(/<[^>]*>/g, "");

  // Helper: safe truncate
  const truncate = (text, limit) => {
    const s = text || "";
    if (!limit || s.length <= limit) return s;
    return `${s.slice(0, limit)}…`;
  };

  return (
    <section
      className={`w-full py-8 ${direction === "rtl" ? "text-right" : ""}`}
      dir={direction}
    >
      <div className="container mx-auto px-4">
        {title ? (
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center">
            {title}
          </h2>
        ) : null}

        <div className={gridClasses}>
          {posts.map((post) => {
            const plainSummary = toPlainText(post?.summary);
            const summaryPreview = truncate(plainSummary, summaryLimit);

            return (
              <Link
                key={post?.id ?? post?.slug}
                href={`/posts/${post?.slug}`}
                className="group block focus:outline-none"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="overflow-hidden rounded-xl"
                >
                  <div className="relative w-full h-60 overflow-hidden">
                    <Image
                      src={post?.media}
                      alt={post?.title || "post"}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105 rounded-xl"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl mb-3 transition-colors text-center">
                      {post?.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 text-center">
                      {summaryPreview}
                    </p>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-sm text-gray-500 mt-6">
            موردی برای نمایش وجود ندارد.
          </p>
        ) : null}
      </div>
    </section>
  );
}

