import ServiceCard from "../BrandServices/ServiceCard";

export default function GalleryGrid({ items, sectionTitle = "Our Services", locale }) {
  if (!items?.length) return null;

  return (
    <section className="py-16 px-4 text-center">
      <h2 className="text-2xl md:text-3xl font-semibold mb-12">
        {sectionTitle}
      </h2>

      <div className="grid gap-10 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 items-stretch">
        {items.map((item) => (
          <ServiceCard key={item.id ?? item.slug} item={item} locale={locale} />
        ))}
      </div>
    </section>
  );
}
