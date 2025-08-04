'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

type AccordionItem = {
  question: string;
  answer: string;
};

type ProductAccordionProps = {
  items: AccordionItem[];
};

export default function ProductAccordion({ items }: ProductAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // میتونه باز یا بسته باشه

  const toggle = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null); // اگه همونه → ببندش
    } else {
      setOpenIndex(index); // اگه نیست → بازش کن
    }
  };

  return (
    <div className="w-full divide-y divide-gray-300 border-y border-gray-300 text-right">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={index}>
            <button
              onClick={() => toggle(index)}
              className="w-full flex justify-between items-center py-5 text-black font-bold text-lg"
            >
              {item.question}

              <motion.div
                initial={false}
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? (
                  <Minus className="w-5 h-5 text-gray-500" />
                ) : (
                  <Plus className="w-5 h-5 text-gray-500" />
                )}
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { height: 'auto', opacity: 1 },
                    collapsed: { height: 0, opacity: 0 },
                  }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div
  className="pb-5 text-sm text-gray-700 leading-relaxed"
  dangerouslySetInnerHTML={{ __html: item.answer }}
/>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
