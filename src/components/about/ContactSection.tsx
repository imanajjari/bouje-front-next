// components/about/ContactSection.tsx
'use client';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

export default function ContactSection() {
  return (
    <section className="py-20 px-6 text-center border-t border-gray-300">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-2xl font-bold mb-4"
      >
        تماس با ما
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-sm text-gray-700"
      >
        <p className="mb-2">ایمیل: contact@luxbrand.ir</p>
        <p className="mb-2">تلفن: ۰۲۱-۱۲۳۴۵۶۷۸</p>
        <p>تهران، خیابان ولیعصر، مجتمع دیزاین، طبقه ۵</p>
      </motion.div>
      <div className="flex justify-center mt-6">
        <Mail className="text-black w-6 h-6" />
      </div>
    </section>
  );
}