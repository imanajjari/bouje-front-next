import Image from 'next/image';

export default function HeroBanner({
  imageSrc,
  fallbackColor = '#e5e5e5',
  title,
  description,
}) {
  const hasImage = !!imageSrc;

  return (
    <section
      className="w-full"
      style={{ backgroundColor: !hasImage ? fallbackColor : undefined }}
    >
      <div className="relative w-full">
        {hasImage ? (
          <Image
            src={imageSrc}
            alt={title}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-40 sm:h-auto object-cover"
            priority
          />
        ) : (
          <div
            className="w-full h-96 bg-gray-300"
            style={{ backgroundSize: 'cover' }}
          />
        )}

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-2xl md:text-4xl font-semibold mb-4">{title}</h1>
          <p className="text-sm md:text-base max-w-xl leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
