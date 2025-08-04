'use client';
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

/**
 * Gucci-style responsive SSR component to show posts in a collection.
 * Accepts optional summary length and column settings.
 */
export default function CollectionPosts({
  collection,
  summaryLimit = 120,
  cols = { base: 1, sm: 2, lg: 3 },
}) {
  const { posts, direction, title } = collection;

  const gridClasses = `grid gap-6 grid-cols-${cols.base} ${cols.sm ? `sm:grid-cols-${cols.sm}` : ""} ${cols.lg ? `lg:grid-cols-${cols.lg}` : ""}`;

  return (
    <section className={`w-full py-8 ${direction === "rtl" ? "text-right" : ""}`} dir={direction}>
      <div className="container mx-auto px-4">
        <div className={gridClasses}>
          {posts.map((post) => (
            <Link key={post.id} href={`/posts/${post.slug}`} className="group block focus:outline-none">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="overflow-hidden  rounded-xl"
              >
                <div className="relative w-full h-60 overflow-hidden">
                  <Image
                    src={post.media}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw "
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105 rounded-xl"
                  />
                </div>

                <div className="p-6">
                  <h3 className=" text-xl mb-3  transition-colors text-center">
                    {post.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 text-center">
                    {post.summary.length > summaryLimit
                      ? `${post.summary.slice(0, summaryLimit)}…`
                      : post.summary}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
