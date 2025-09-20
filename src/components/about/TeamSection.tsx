"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function TeamSection({ members = [], footer }) {
  return (
    <section className="py-28 px-6 bg-gray-50 text-black">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-extrabold text-center mb-16"
        >
          مدیران و معماران برند ما
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {members.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.3 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-xl transition"
            >
              <div className="w-32 h-32 mx-auto relative">
                <Image
                  src={m.avatar}
                  alt={m.full_name}
                  fill     // ✅ تصویر کل کانتینر رو پر می‌کنه
                  className="rounded-full object-cover border-4 border-black"
                />
              </div>

              <div className="text-center mt-6">
                <h3 className="text-xl font-bold">{m.full_name}</h3>
                <p className="text-gray-500 text-sm mt-1">{m.position}</p>
                <p className="text-gray-600 text-xs mt-4 leading-relaxed">
                  {m.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {footer?.paragraph && (
          <div className="text-center mt-16 text-gray-500 text-sm max-w-3xl mx-auto leading-loose">
            {footer.paragraph}
          </div>
        )}
      </div>
    </section>
  );
}
