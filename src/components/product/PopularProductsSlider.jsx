'use client';

import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useState, useEffect } from 'react';
import { productService } from '../../services/product/productService';

export default function PopularProductsSlider({
  slidesPerView = { default: 2, spacing: 0 },
  breakpoints,
  autoPlay = false,
  autoPlayInterval = 5000,
  showTitle = true,
  showPrice = true,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);

  const [sliderRef, instanceRef] = useKeenSlider({
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
        }, {})
      : undefined,
    defaultAnimation: {
      duration: 800,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    },
  });

  useEffect(() => {
    productService.getPopularProducts()
      .then((res) => {
        setProducts(res);
      })
      .catch((err) => {
        console.error("خطا در دریافت محصولات محبوب:", err);
      });
  }, []);

  useEffect(() => {
    if (!autoPlay || !instanceRef.current) return;
    const interval = setInterval(() => {
      instanceRef.current.next();
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [instanceRef, autoPlay, autoPlayInterval]);

  if (!products || products.length < 3) return null;

  return (
    <div className="relative w-full md:px-4 md:border border-gray-300">
      <div className="flex md:hidden items-center space-x-4 mb-6">
        <div>
          <h3 className="text-xl font-bold">محصولات محبوب</h3>
          <p className="text-sm text-gray-500">محصولاتی که بیشتر دیده شده‌اند.</p>
        </div>
      </div>

      <div ref={sliderRef} className="keen-slider">
        <div className="hidden md:flex keen-slider__slide flex-col items-center justify-center space-y-3 border-r border-gray-300">
          <h3 className="text-center text-sm text-gray-700">محصولات محبوب</h3>
          <p className="text-sm text-gray-500">پرفروش‌ترین یا پر بازدیدترین‌ها</p>
        </div>

        {products.map((item, index) => (
          <div
            key={index}
            className={`keen-slider__slide flex flex-col items-center justify-center ${
              index !== products.length - 1 ? 'border-r border-gray-300' : ''
            }`}
          >
            <div className="aspect-square w-full overflow-hidden flex items-center justify-center bg-white">
              <img
                src={item.image}
                alt={item.name}
                className="object-contain max-h-72"
              />
            </div>

            {showTitle && <p className="text-center text-sm text-gray-700 md:hidden">{item.name}</p>}

            {showPrice && item.price && (
              <p className="text-center text-xs text-gray-500 md:hidden">
                {parseInt(item.price).toLocaleString('fa-IR')} تومان
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
