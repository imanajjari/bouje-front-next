
import Link from "next/link";

/**
 * ServiceCard
 * - Renders a media card (image/video)
 * - Safely strips HTML from description
 * - Handles locale-aware links
 */
export default function ServiceCard({ item, locale }) {
  // تشخیص ویدیو
  const isVideo = /\.(mp4|webm|ogg)$/i.test(item?.mediaSrc || "");

  // پاک‌سازی HTML از description
  const plainDescription = (item?.description || "")
    .replace(/<[^>]*>/g, "")
    .trim();

  // ساخت href امن
  const href = `/${locale}${item?.ctaHref || ""}`;

  return (
    <div className="flex flex-col items-center text-center max-w-sm mx-auto">
      <Link href={href} className="block focus:outline-none">
        {/* Media */}
        <div className="w-full aspect-[4/5] relative overflow-hidden rounded">
          {isVideo ? (
            <video
              src={item.mediaSrc}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={item.mediaSrc}
              alt={item?.title || ""}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
        </div>

        {/* Title */}
        <h3 className="mt-6 text-sm font-semibold uppercase">
          {item?.title}
        </h3>

        {/* Description */}
        {plainDescription && (
          <p className="mt-2 text-sm text-gray-700">
            {plainDescription}
          </p>
        )}

        {/* CTA */}
        <p className="mt-4 text-sm font-medium hover:underline hover:opacity-70 transition">
          مشاهده
        </p>
      </Link>
    </div>
  );
}

