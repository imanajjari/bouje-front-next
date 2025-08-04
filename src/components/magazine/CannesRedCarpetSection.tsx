import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "../../services/magazine/magazineService";

export default function CannesRedCarpetSectionSSR({
  posts,
  locale,
}: {
  posts: BlogPost[];
  locale: string;
}) {
  const sorted = [...posts].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const level3 = sorted.filter((p) => p.featured_level === 3);
  const level2 = sorted.filter((p) => p.featured_level === 2);
  const level1 = sorted.filter((p) => p.featured_level === 1);

  const center = level3.at(-1);
  const left = level2.slice(-2);
  const right = level1.slice(-5);

  if (!center) {
    return (
      <section className="py-10 text-center" aria-label="Red Carpet Section">
        {/* <p className="text-red-600">مقاله‌ای یافت نشد</p> */}
      </section>
    );
  }

  const renderTags = (tags: string[]) =>
    tags.map((tag, i) => (
      <Link
        href={`/${locale}/magazine/tag/${tag}`}
        key={i}
        className="text-[10px] text-gray-500 hover:underline"
        aria-label={`مشاهده تگ ${tag}`}
      >
        #{tag}
        {i < tags.length - 1 ? ", " : ""}
      </Link>
    ));

  const ArticleCard = ({ article }: { article: BlogPost }) => (
    <article className="space-y-2" aria-labelledby={`title-${article.id}`}>
      <Link href={`/${locale}/magazine/${article.slug}`}>
        <Image
          src={article.media}
          alt={article.title}
          width={300}
          height={200}
          className="w-full object-cover rounded-md"
        />
      </Link>
      <p className="text-[10px] text-gray-400 font-semibold uppercase">
        {article.tags?.[0] ?? "عمومی"}
      </p>
      <h3 id={`title-${article.id}`} className="text-xs font-semibold leading-tight">
        <Link href={`/${locale}/magazine/${article.slug}`}>{article.title}</Link>
      </h3>
    </article>
  );

  return (
    <section className="flex flex-col items-center px-4 py-10 max-w-screen-xl mx-auto" dir="rtl" aria-label="Cannes Red Carpet Section">
      <div className="flex flex-col md:flex-row gap-6 w-full">

        {/* ستون چپ */}
        <div className="order-2 md:order-none md:basis-1/4 space-y-5 max-w-sm md:max-w-full mx-auto">
          {left.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {/* تصویر مرکزی */}
        <div className="order-1 md:order-none md:basis-1/2 flex flex-col items-center">
          <article className="w-full" aria-labelledby={`title-${center.id}`}>
            <Link href={`/${locale}/magazine/${center.slug}`}>
              <Image
                src={center.media}
                alt={center.title}
                width={600}
                height={800}
                className="rounded-xl shadow-2xl w-full object-cover"
              />
            </Link>
            <div className="text-center mt-8 px-4">
              <p className="text-lg text-gray-500 font-medium">
                {center.tags?.[0] ?? "عمومی"}
              </p>
              <h1 id={`title-${center.id}`} className="text-4xl font-extrabold leading-tight mt-3">
                <Link href={`/${locale}/magazine/${center.slug}`}>{center.title}</Link>
              </h1>
              <div className="text-sm mt-3 flex flex-wrap justify-center gap-1">
                {renderTags(center.tags ?? [])}
              </div>
            </div>
          </article>
        </div>

        {/* ستون راست */}
        <div className="order-3 md:order-none md:basis-1/4 space-y-6">
          {right.map((article) => (
            <article key={article.id} aria-labelledby={`title-${article.id}`}>
              <Link
                href={`/${locale}/magazine/${article.slug}`}
                className="flex items-start gap-3"
              >
                <Image
                  src={article.media}
                  alt={article.title}
                  width={60}
                  height={60}
                  className="rounded-md object-cover"
                />
                <div>
                  <p className="text-[11px] text-gray-400 font-semibold uppercase">
                    {article.tags?.[0] ?? "عمومی"}
                  </p>
                  <h3 id={`title-${article.id}`} className="text-sm font-semibold leading-snug">
                    {article.title}
                  </h3>
                </div>
              </Link>
              <div className="text-[10px] text-gray-500 mt-1 flex flex-wrap gap-1 ml-14">
                {renderTags(article.tags ?? [])}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
