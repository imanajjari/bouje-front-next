import React, { useState } from 'react';
import { IoClose, IoPlay, IoPause } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';

const MediaModal = ({ mediaItems, buttonLabel = 'نمایش مدیا' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const hasVisualMedia = mediaItems.some(
    (item) => item.type === 'image' || item.type === 'video'
  );

  if (!hasVisualMedia) return null;

  const currentMedia = mediaItems[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
    setIsPlaying(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    preventScrollOnSwipe: true,
    trackMouse: true, // برای تست با موس
  });

  return (
    <>
      {/* دکمه باز کردن مدیا */}
      <div className="flex justify-center w-full p-5">
        <button
          onClick={() => setIsOpen(true)}
          className="px-6 py-3 bg-black text-white font-inter uppercase tracking-wide hover:bg-gray-800 transition"
        >
          {buttonLabel}
        </button>
      </div>

      {/* مدال */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0000003b] backdrop-blur-sm bg-opacity-80"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl w-full mx-4 sm:mx-6 md:mx-8 bg-white rounded-lg shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-10 text-gray-600 hover:text-black transition-colors"
                aria-label="Close modal"
              >
                <IoClose size={24} />
              </button>

              {/* سوییپ‌بل */}
              <div {...swipeHandlers} className="relative touch-pan-y">
                {currentMedia.type === 'image' && (
                  <img
                    src={currentMedia.image}
                    alt={currentMedia.alt_text || 'Product image'}
                    className="w-full h-auto max-h-[70vh] object-contain"
                  />
                )}
                {currentMedia.type === 'video' && (
                  <div className="relative">
                    <video
                      src={currentMedia.image}
                      autoPlay={isPlaying}
                      controls={false}
                      className="w-full h-auto max-h-[70vh] object-contain"
                    />
                    <button
                      onClick={togglePlay}
                      className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
                      aria-label={isPlaying ? 'Pause video' : 'Play video'}
                    >
                      {isPlaying ? <IoPause size={20} /> : <IoPlay size={20} />}
                    </button>
                  </div>
                )}
                {currentMedia.type === 'file' && (
                  <div className="flex flex-col items-center justify-center h-[50vh] p-6">
                    <p className="text-lg font-roboto-mono text-gray-800 mb-4">
                      {currentMedia.name || 'File'}
                    </p>
                    <a
                      href={currentMedia.image}
                      download
                      className="px-6 py-3 bg-black text-white font-inter uppercase tracking-wide hover:bg-gray-800 transition"
                    >
                      Download File
                    </a>
                  </div>
                )}
              </div>

              {/* ناوبری پایین */}
              {mediaItems.length > 1 && (
                <div className="flex justify-between items-center p-4 bg-gray-100">
                  <button
                    onClick={handlePrev}
                    className="text-gray-600 hover:text-black font-inter uppercase tracking-wide"
                  >
                    قبلی
                  </button>
                  <span className="font-roboto-mono text-gray-600">
                    {currentIndex + 1} / {mediaItems.length}
                  </span>
                  <button
                    onClick={handleNext}
                    className="text-gray-600 hover:text-black font-inter uppercase tracking-wide"
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

