

import ServiceCard from './ServiceCard';


export default function BrandServicesSection({ items, sectionTitle = 'Our Services' }) {
  return (
    <section className="py-16 px-4 text-center">
      <h2 className="text-2xl md:text-3xl font-semibold mb-12">{sectionTitle}</h2>
      <div className="grid gap-10 md:grid-cols-3">
        {items.map((item, idx) => (
          <ServiceCard key={idx} item={item} />
        ))}
      </div>
    </section>
  );
}
