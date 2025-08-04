import Image from 'next/image';

interface ProductCardProps {
  imageSrc: string;
  title: string;
  price: string;
  colors?: string[]; // آرایه‌ای از کدهای رنگی
  onAddToCart?: () => void;
  onViewDetails?: () => void;
}

export default function ProductCard({
  imageSrc,
  title,
  price,
  colors = [],
  onAddToCart,
  onViewDetails,
}: ProductCardProps) {
  return (
    <div className="w-full">
      <div className="border border-gray-200 overflow-hidden transition-shadow duration-300">
      <div className="relative w-full h-48 sm:h-64 md:h-72 lg:h-80">
  <Image
    src={imageSrc}
    alt={title}
    layout="fill"
    objectFit="contain"
    className="object-contain hover:scale-105 transition-transform duration-300"
  />
</div>
        <div className="p-4">
          <h3 className="text-sm md:text-lg font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-sm md:text-lg text-gray-600 mb-4">{price}</p>
          {colors.length > 0 && (
            <div className="flex items-center mb-4">
              {colors.map((color, index) => (
                <span
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-300 mr-2"
                  style={{ backgroundColor: color }}
                ></span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
