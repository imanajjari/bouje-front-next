'use client';

import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface images {
  image_url: string;
  alt_text: string;
}

interface ProductShowcaseBannerProps {
  images: images[];
  children: React.ReactNode;
}

export default function ProductShowcaseBanner({ images, children }: ProductShowcaseBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    slides: {
      origin: 'center',
      perView: 1,
      spacing: 0,
    },
    breakpoints: {
      '(min-width: 768px)': {
        slides: {
          origin: 'auto',
          perView: 2,
          spacing: 300,
        },
      },
    },
    defaultAnimation: {
      duration: 1000,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    },
  });

  const goPrev = () => instanceRef.current?.prev();
  const goNext = () => instanceRef.current?.next();

  return (
    <div className="relative w-full">
      <div ref={sliderRef} className="keen-slider">
        {images.map((image, index) => (
          <div
            key={index}
            className="keen-slider__slide"
            style={{ transition: 'opacity 0.5s' }}
          >
            <div className="aspect-square w-full overflow-hidden flex justify-center relative">
              <Image
                src={image.image_url}
                alt={image.alt_text}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
                priority={index === 0} // اسلاید اول سریع‌تر لود بشه
              />
            </div>
          </div>
        ))}
      </div>

      {/* Slide indicator */}
      <div className="mt-6 flex justify-center">
        <div className="text-gray-600 text-sm md:text-base font-medium">
          {currentSlide + 1} / {images.length}
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        {/* Center Fixed Content فقط موبایل */}
        <div className="block md:hidden z-10">{children}</div>
      </div>

      {/* Center Fixed Content فقط دسکتاپ */}
      <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        {children}
      </div>

      {/* Arrows */}
      <button
        onClick={goPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 transition"
      >
        <ChevronLeft className="w-10 h-10 text-gray-500" />
      </button>

      <button
        onClick={goNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 transition"
      >
        <ChevronRight className="w-10 h-10 text-gray-500" />
      </button>
    </div>
  );
}
