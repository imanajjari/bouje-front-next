

import Link from "next/link";

export default function ServiceCard({ item, locale }) {
  // تشخیص اینکه media ویدیو است یا عکس
  const isVideo = /\.(mp4|webm|ogg)$/i.test(item.media ?? "");

  return (
    <div className="flex flex-col items-center text-center max-w-sm mx-auto">
      <Link href={`/${locale}${item.ctaHref}`}>
        <div className="w-full aspect-[4/5] relative overflow-hidden rounded">
          {/* {isVideo ? (
            <video
              src={item.mediaSrc}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : ( */}
            <img
              src={item.mediaSrc}
              alt={item.title || "تصویر"}
              className="w-full h-full object-cover"
            />
          {/* )} */}
        </div>

        <h3 className="mt-6 text-sm font-semibold uppercase">{item.title}</h3>

        <p className="mt-2 text-sm text-gray-700">{item.description}</p>

        <p className="mt-4 text-sm font-medium  hover:underline hover:opacity-70 transition">
          مشاهده
        </p>
      </Link>
    </div>
  );
}
