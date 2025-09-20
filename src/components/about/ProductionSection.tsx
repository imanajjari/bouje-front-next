"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ProductionSection({ production }) {
  if (!production) return null;

  const { title, rich_text, image } = production;

  return (
    <section className="py-24 bg-black text-white px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-6">{title}</h2>

          {/* rich_text حاوی HTML آماده است */}
          <div
            className="text-gray-300 leading-relaxed text-sm md:text-base space-y-4"
            dangerouslySetInnerHTML={{ __html: rich_text }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Image
            src={image}
            alt={title}
            width={600}       
            height={400}
            className="rounded-xl shadow-xl border border-white/10"
          />
        </motion.div>
      </div>
    </section>
  );
}
