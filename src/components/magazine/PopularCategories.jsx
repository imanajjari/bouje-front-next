'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fetchPopularBlogData } from '../../services/magazine/magazineService';

export default function PopularCategories() {
  const [categories, setCategories] = useState([]);
  const params = useParams();

  useEffect(() => {
    const loadPopular = async () => {
      try {
        const data = await fetchPopularBlogData();

        // اصلاح کلید خروجی براساس دیتا واقعی
        const all = data.popular_categories || [];
        setCategories(all.slice(0, 5));
      } catch (err) {
        console.error('خطا در دریافت دسته‌بندی‌های محبوب:', err);
      }
    };
    loadPopular();
  }, []);

  if (!categories.length) return null;

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-bold mb-4">دسته‌بندی‌های محبوب</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/${params.locale}/magazine/category/${cat.slug}`}
            className="px-3 py-1 text-xs bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors border"
          >
            #{cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
