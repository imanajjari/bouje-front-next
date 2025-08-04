'use client';

import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import Link from 'next/link';



export default function PromoBanner({
  imageSrc,
  tag = '',
  title,
  buttonText,
  href
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (inView) {
      setAnimate(true);
    }
  }, [inView]);

  return (
    <div ref={ref} className="relative w-full h-[90vh] overflow-hidden">
      <div
        className={`absolute inset-0 transition-transform duration-[2000ms] ease-out ${
          animate ? 'scale-100' : 'scale-130'
        }`}
      >
        <Image
          src={imageSrc}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="z-0"
          priority
        />
      </div>

      {/* Tag */}
      {tag && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md text-white text-xs px-4 py-1 uppercase tracking-wider font-medium rounded-sm shadow">
          {tag}
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center text-white">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 drop-shadow-lg">{title}</h2>
        <Link
          href={href}
          className="text-white backdrop-blur-xl text-sm font-semibold px-6 py-2 border border-white rounded hover:bg-white transition-all duration-300"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}
