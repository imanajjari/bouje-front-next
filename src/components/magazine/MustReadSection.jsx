import Image from 'next/image';
import Link from 'next/link';

export default function MustReadSection({ title, items = [] }) {
  if (items.length === 0) return null;

  return (
    <section
      className="w-full bg-gray-50 py-8 px-4"
      aria-labelledby="must-read-heading"
    >
      <div className="max-w-screen-xl mx-auto">
        <h2
          id="must-read-heading"
          className="text-center text-sm font-semibold tracking-widest text-gray-600 uppercase mb-6"
        >
          {title}
        </h2>

        <div className="flex justify-around items-center gap-6 flex-wrap">
          {items.map((item) => (
            <article
              key={item.url}
              className="max-w-sm w-full"
              aria-labelledby={`mustread-title-${item.url}`}
            >
              <Link href={item.url} className="space-y-2 block">
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-600 tracking-wide">
                      {item.category}
                    </p>
                    <h3
                      id={`mustread-title-${item.url}`}
                      className="text-sm font-medium text-black leading-snug mt-1"
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 font-semibold uppercase">
                      <span className="sr-only">نویسنده:</span>
                      By {item.author}
                    </p>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
