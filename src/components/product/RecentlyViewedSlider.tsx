'use client';

import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type ViewedItem = {
  title: string;
  image: string;
  price?: string;
};

type RecentlyViewedSliderProps = {
  items: ViewedItem[];
  slidesPerView: {
    default: number;
    spacing: number;
  };
  breakpoints?: {
    [key: string]: {
      perView: number;
      spacing: number;
    };
  };
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showTitle?: boolean;
  showPrice?: boolean;
};

export default function RecentlyViewedSlider({
  items,
  slidesPerView,
  breakpoints,
  autoPlay = false,
  autoPlayInterval = 5000,
  showTitle = false,
  showPrice = false,
}: RecentlyViewedSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: false,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    slides: {
      origin: 'auto',
      perView: slidesPerView.default,
      spacing: slidesPerView.spacing,
    },
    breakpoints: breakpoints
      ? Object.entries(breakpoints).reduce((acc, [key, value]) => {
          acc[key] = {
            slides: {
              origin: 'auto',
              perView: value.perView,
              spacing: value.spacing,
            },
          };
          return acc;
        }, {} as any)
      : undefined,
    defaultAnimation: {
      duration: 800,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    },
  });

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      if (instanceRef.current) {
        instanceRef.current.next();
      }
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [instanceRef, autoPlay, autoPlayInterval]);

  return (
    <div className="relative w-full md:px-4 md:border border-gray-300">
      <div className="flex md:hidden items-center space-x-4 mb-6">
        <div>
          <h3 className="text-xl font-bold">موارد مشاهده شده اخیر</h3>
          <p className="text-sm text-gray-500">محصولاتی که اخیراً مشاهده کرده‌اید.</p>
        </div>
      </div>

      <div ref={sliderRef} className="keen-slider">
      <div  className="hidden md:flex keen-slider__slide  flex-col items-center justify-center space-y-3 border-r border-gray-300">


              <h3 className="text-center text-sm text-gray-700">موارد مشاهده شده اخیر</h3>
              <p className="text-sm text-gray-500">محصولاتی که اخیراً مشاهده کرده‌اید.</p>

          </div>
          
        {items.map((item, index) => (
            
            <div
            key={index}
            className={`keen-slider__slide  flex flex-col items-center justify-center ${index !== items.length - 1 ? 'border-r border-gray-300' : ''}`}
          >
            <div className="aspect-square w-full overflow-hidden flex items-center justify-center bg-white">
              <img
                src={item.image}
                alt={item.title}
                className="object-contain max-h-72"
              />
            </div>

            {showTitle && (
              <p className="text-center text-sm text-gray-700 md:hidden">{item.title}</p>
            )}

            {showPrice && item.price && (
              <p className="text-center text-xs text-gray-500 md:hidden">{item.price}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
