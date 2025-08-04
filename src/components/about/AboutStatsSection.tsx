"use client";
import { Award, Store, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const iconMap = {
  awards: <Award />,
  stores: <Store />,
  mission: <CheckCircle />,
};

export default function AboutStatsSection({ cards = [] }) {
  return (
    <section className="grid md:grid-cols-3 gap-10 px-6 py-20 max-w-7xl mx-auto text-center border-y border-gray-300">
      {cards.map(({ icon_key, title, description }, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.2 }}
          viewport={{ once: true }}
          className="p-6 border border-gray-300 rounded-xl bg-white"
        >
          <div className="text-black w-10 h-10 mx-auto">
            {iconMap[icon_key] ?? <Award />}
          </div>
          <h4 className="font-bold text-lg mt-3">{title}</h4>
          <p className="text-sm text-gray-700 mt-2">{description}</p>
        </motion.div>
      ))}
    </section>
  );
}
