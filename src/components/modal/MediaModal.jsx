'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { IoClose, IoPlay, IoPause } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import Image from 'next/image';


const MediaModal = ({
  mediaItems,
  buttonLabel = 'نمایش مدیا',
}) => {
  // 1) فallback امن برای ورودی
  const items = useMemo(
    () => (Array.isArray(mediaItems) ? mediaItems : []),
    [mediaItems]
  );

  // 2) فقط مدیای قابل‌نمایش داخل مودال
  const visualItems = useMemo(
    () => items.filter((it) => it && (it.type === 'image' || it.type === 'video')),
    [items]
  );

  // ⚠️ همه‌ی هوک‌ها باید قبل از هر return باشند
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // reset وقتی لیست تغییر کرد
  useEffect(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
  }, [visualItems]);

  // جلوگیری از out-of-range
  const safeIndex = Math.min(Math.max(currentIndex, 0), Math.max(visualItems.length - 1, 0));
  const currentMedia = visualItems[safeIndex];

  const handleNext = useCallback(() => {
    if (visualItems.length < 2) return;
    setCurrentIndex((prev) => (prev + 1) % visualItems.length);
    setIsPlaying(false);
  }, [visualItems.length]);

  const handlePrev = useCallback(() => {
    if (visualItems.length < 2) return;
    setCurrentIndex((prev) => (prev - 1 + visualItems.length) % visualItems.length);
    setIsPlaying(false);
  }, [visualItems.length]);

  const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);

  // ناوبری با کیبورد وقتی مدال بازه
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, handleNext, handlePrev, togglePlay]);

  // swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  // ⬅️ بعد از هوک‌ها می‌تونیم زودتر خروج کنیم
  if (visualItems.length === 0) {
    return null;
  }

  return (
    <>
      {/* دکمه باز کردن مدیا */}
      <div className="flex justify-center w-full p-5">
        <button
          onClick={() => setIsOpen(true)}
          className="px-6 py-3 bg-black text-white font-inter uppercase tracking-wide hover:bg-gray-800 transition rounded-md"
        >
          {buttonLabel}
        </button>
      </div>

      {/* مدال */}
      <AnimatePresence>
        {isOpen && currentMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            aria-modal="true"
            role="dialog"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="relative max-w-4xl w-full mx-4 sm:mx-6 md:mx-8 bg-white rounded-lg shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-10 text-gray-600 hover:text-black transition-colors"
                aria-label="بستن مدال"
              >
                <IoClose size={24} />
              </button>

              {/* محتوای مدیا + سوییپ */}
              <div {...swipeHandlers} className="relative touch-pan-y">
                {/* رپر با ارتفاع کنترل‌شده برای Image fill و video */}
                <div className="relative w-full" style={{ height: '70vh' }}>
                  {currentMedia.type === 'image' && (
                    <Image
                      src={currentMedia.image}
                      alt={currentMedia.alt_text || 'Product image'}
                      fill
                      sizes="(max-width: 768px) 100vw, 70vw"
                      className="object-contain bg-black/5"
                      priority
                    />
                  )}

                  {currentMedia.type === 'video' && (
                    <div className="relative w-full h-full bg-black/5">
                      <video
                        key={currentMedia.image /* تعویض سورس => ریست پلیر */}
                        src={currentMedia.image}
                        autoPlay={isPlaying}
                        controls={false}
                        className="w-full h-full object-contain"
                      />
                      <button
                        onClick={togglePlay}
                        className="absolute bottom-4 left-4 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition"
                        aria-label={isPlaying ? 'توقف ویدئو' : 'پخش ویدئو'}
                      >
                        {isPlaying ? <IoPause size={20} /> : <IoPlay size={20} />}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ناوبری پایین */}
              {visualItems.length > 1 && (
                <div className="flex justify-between items-center p-4 bg-gray-100">
                  <button
                    onClick={handlePrev}
                    className="text-gray-700 hover:text-black font-inter uppercase tracking-wide"
                  >
                    قبلی
                  </button>
                  <span className="font-roboto-mono text-gray-700">
                    {safeIndex + 1} / {visualItems.length}
                  </span>
                  <button
                    onClick={handleNext}
                    className="text-gray-700 hover:text-black font-inter uppercase tracking-wide"
                  >
                    بعدی
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MediaModal;
