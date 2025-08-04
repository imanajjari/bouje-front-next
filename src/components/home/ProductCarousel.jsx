'use client';

import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';



export default function ProductCarousel({
  products,
  slidesPerView,
  breakpoints,
  blur = { active: 0, adjacent: 4, others: 8 },
  opacity = { active: 1, adjacent: 0.5, others: 0.2 },
  autoPlay = true,
  autoPlayInterval = 5000,
  showTitleMode = 'active',
  showPrice = false,
  showArrows = true,
  direction = 'ltr',
  arrowColor = 'gray',
}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    slides: {
      origin: 'center',
      perView: slidesPerView.default,
      spacing: slidesPerView.spacing,
    },
    breakpoints: breakpoints
      ? Object.entries(breakpoints).reduce((acc, [key, value]) => {
          acc[key] = {
            slides: {
              origin: 'center',
              perView: value.perView,
              spacing: value.spacing,
            },
          };
          return acc;
        }, {}) // ← این مقدار اولیه رو هم اضافه کردیم
      : undefined,
    defaultAnimation: {
      duration: 1000,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    },
  });
  

  // Autoplay
  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      if (instanceRef.current) {
        direction === 'ltr' ? instanceRef.current.next() : instanceRef.current.prev();
      }
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [instanceRef, autoPlay, autoPlayInterval, direction]);

  const goPrev = () => {
    if (instanceRef.current) {
      direction === 'ltr' ? instanceRef.current.prev() : instanceRef.current.next();
    }
  };

  const goNext = () => {
    if (instanceRef.current) {
      direction === 'ltr' ? instanceRef.current.next() : instanceRef.current.prev();
    }
  };

  return (
    <div className="relative w-full">
      <div ref={sliderRef} className="keen-slider">
        {products.map((product, index) => {
          const isActive = currentSlide === index;
          const isAdjacent =
            index === (currentSlide + 1) % products.length ||
            index === (currentSlide - 1 + products.length) % products.length;

          const blurAmount = isActive
            ? blur.active
            : isAdjacent
            ? blur.adjacent
            : blur.others;

          const opacityAmount = isActive
            ? opacity.active
            : isAdjacent
            ? opacity.adjacent
            : opacity.others;

          const showTitle = showTitleMode === 'all' || (showTitleMode === 'active' && isActive);

          return (
            <Link href={product.url} key={product.id || product.slug || index}>
              <div
                className="keen-slider__slide flex flex-col items-center"
                style={{
                  transition: 'opacity 0.5s, filter 0.5s',
                  filter: `blur(${blurAmount}px)`,
                  opacity: opacityAmount,
                }}
              >
                <div className="aspect-square w-full overflow-hidden flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="object-contain max-h-full"
                  />
                </div>
          
                {showTitle && (
                  <motion.h3
                    className="mt-4 text-center text-sm md:text-base text-gray-700 font-medium"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {product.title}
                  </motion.h3>
                )}
          
                {showPrice && (
                  <p className="text-xs mt-2 text-gray-500">{product.price}</p>
                )}
              </div>
            </Link>
          );
          
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-10 flex justify-center">
        <div className="relative w-32 h-0.5 bg-gray-300">
          <div
            className="absolute top-0 h-0.5 transition-all duration-300"
            style={{
              backgroundColor: arrowColor,
              width: `${100 / products.length}%`,
              left: `${(100 / products.length) * currentSlide}%`,
            }}
          />
        </div>
      </div>

      {/* Arrows */}
      {showArrows && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 transition"
          >
            <ChevronLeft className="w-10 h-10 opacity-40" style={{ color: arrowColor }} />
          </button>

          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 transition"
          >
            <ChevronRight className="w-10 h-10 opacity-40" style={{ color: arrowColor }} />
          </button>
        </>
      )}
    </div>
  );
}
