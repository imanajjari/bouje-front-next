"use client";
import { ShieldCheck, Rocket, Users } from "lucide-react";
import { motion } from "framer-motion";

const iconMap = {
  mission: <ShieldCheck />,
  vision:  <Rocket />,
  values:  <Users />,
};

export default function AboutMissionSection({ cards = [] }) {
  return (
    <section className="grid md:grid-cols-3 gap-10 px-6 py-20 max-w-7xl mx-auto text-center">
      {cards.map(({ icon_key, title, description }, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.2 }}
          viewport={{ once: true }}
          className="p-8 rounded-xl border border-black/10 shadow-sm"
        >
          <div className="text-black w-10 h-10 mx-auto">
            {iconMap[icon_key] ?? <ShieldCheck />}
          </div>
          <h3 className="text-xl font-bold mt-4">{title}</h3>
          <p className="text-sm mt-2 text-gray-700">{description}</p>
        </motion.div>
      ))}
    </section>
  );
}
