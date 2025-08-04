

import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({
  imageSrc,
  title,
  price,
  colors = [],
  productLink,
}) {
  return (
    <div className="w-full">
      <div className="border border-gray-200 overflow-hidden transition-shadow duration-300">
        <Link href={productLink}>
          <div className="relative w-full h-48 sm:h-64 md:h-72 lg:h-80">
            <Image
              src={imageSrc}
              alt={title}
              layout="fill"
              objectFit="contain"
              className="object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
        <div className="p-4">
          <h3 className="text-sm md:text-lg font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-sm md:text-lg text-gray-600 mb-4">{price}</p>

          {colors.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mb-4">
              {colors.map((color, index) => (
                <div key={index} className="flex items-center gap-1">
                  <span
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.hex_code }}
                    title={color.name}
                  ></span>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-between">
            {/* <button
              onClick={onAddToCart}
              className="text-sm md:text-lg bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors duration-300"
            >
              افزودن به سبد خرید
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
