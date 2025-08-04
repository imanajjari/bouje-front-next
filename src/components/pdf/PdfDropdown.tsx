"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { fetchPdfCollection } from "../../services/pdf/pdfService";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function PdfDropdown({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const [pdfs, setPdfs] = useState([]);

  useEffect(() => {
    fetchPdfCollection(locale).then((data) => {
      if (data?.items) setPdfs(data.items);
    });
  }, [locale]);
  return (
    <div className="relative group">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 hover:opacity-70 transition text-sm font-medium"
      >
        <span> بیش تر</span>
        <ChevronDown size={16} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50"
          >
            <ul className="p-2">
              {pdfs.map((item) => (
                <li key={item.id}>

                  <Link
  href={`/${locale}/pdf-viewer/${item.id}`}
  className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
>
  {item.title}
</Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
