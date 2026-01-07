import Link from "next/link";

export default function ServiceCard({ item, locale }) {
  // یکدست: از item.media استفاده کن (هم برای تشخیص، هم برای src)
  const media = item.media ?? item.mediaSrc ?? "";
  const isVideo = /\.(mp4|webm|ogg)$/i.test(media);

  return (
    <div className="h-full">
      <Link href={`/${locale}${item.ctaHref}`} className="block h-full">
        <div className="h-full flex flex-col items-center text-center">
    <div className="w-full aspect-[4/5] overflow-hidden rounded">
  {isVideo ? (
    <video
      src={media}
      autoPlay
      muted
      loop
      playsInline
      className="w-full h-full object-cover object-center"
    />
  ) : (
    <img
      src={media}
      alt={item.title || "تصویر"}
      loading="lazy"
      decoding="async"
      className="w-full h-full object-cover object-center"
    />
  )}
</div>


          {/* متن‌ها را هم‌ارتفاع می‌کنیم تا کارت‌ها هم‌قد شوند */}
          <h3 className="mt-4 text-sm font-semibold uppercase line-clamp-1 min-h-[1.5rem]">
            {item.title}
          </h3>

          <p className="mt-2 text-sm text-gray-700 line-clamp-2 min-h-[2.5rem]">
            {item.description}
          </p>

          <p className="mt-auto pt-4 text-sm font-medium hover:underline hover:opacity-70 transition">
            مشاهده
          </p>
        </div>
      </Link>
    </div>
  );
}
