'use client';

import ProductCarousel from '../../components/home/ProductCarousel';
import { useEffect, useState } from 'react';

export default function ResponsiveCarouselWrapper({
  collection,
  minItems = 4,
  centerIfSmall = true,
  responsiveSettings = {
    base: { maxWidth: '100%', justify: 'center' },
    md: { maxWidth: '768px', justify: 'center' },
    lg: { maxWidth: '1024px', justify: 'start' },
  },
}) {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const updateSize = () => setWindowWidth(window.innerWidth);
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const justifyClass = () => {
    const itemsCount = collection?.posts?.length || 0;
    if (!centerIfSmall || itemsCount >= minItems) return 'justify-start';

    if (windowWidth >= 1024) return responsiveSettings.lg.justify;
    if (windowWidth >= 768) return responsiveSettings.md.justify;
    return responsiveSettings.base.justify;
  };

  return (
    <div
      className={`px-4 py-10 max-w-screen-xl mx-auto flex flex-col ${justifyClass()}`}
      dir={collection.direction || 'rtl'}
    >
      <h3 className="text-center border-y p-2 m-2 text-xl font-bold md:text-4xl border-gray-400">
        {collection.title}
      </h3>
      <ProductCarousel
        products={collection.posts.map((p) => ({
          title: p.title,
          image: p.media,
          price: '',
        }))}
        slidesPerView={{
          default: 5,
          spacing: 10,
        }}
        breakpoints={{
          '(min-width: 768px)': {
            perView: 7,
            spacing: 40,
          },
          '(min-width: 1024px)': {
            perView: 3.5,
            spacing: 20,
          },
        }}
        blur={{ active: 0, adjacent: 0, others: 0 }}
        opacity={{ active: 1, adjacent: 1, others: 1 }}
        autoPlay={true}
        autoPlayInterval={4000}
        showTitleMode="all"
        showPrice={false}
        showArrows={true}
        direction={collection.direction || 'rtl'}
        arrowColor="#000000FF"
      />
    </div>
  );
}
