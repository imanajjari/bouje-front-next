'use client';

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { productService } from "../../services/product/productService";

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1]; // مثلا "fa" یا "en"

  const fetchSearchResults = () => {
    if (!query.trim()) return;

    setLoading(true);
    productService.searchProducts(query)
      .then((data) => setResults(data))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  };

  // اجرا هنگام تایپ با debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetchSearchResults();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const goToSearchPage = () => {
    if (!query.trim()) return;
    router.push(`/${locale}/products?q=${encodeURIComponent(query.trim())}`);
    onClose(); // بستن پنجره
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      ></div>

      <div className="fixed top-[80px] left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4">
        <div
          className="bg-white rounded-xl shadow-lg flex flex-col gap-3 px-4 py-3 transition-all duration-300 ease-out border border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2">
            <button onClick={goToSearchPage}>
              <Search className="text-gray-500" size={20} />
            </button>

            <input
              type="text"
              placeholder="جستجو کنید..."
              className="w-full outline-none text-sm bg-transparent placeholder-gray-400"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  goToSearchPage();
                }
              }}
            />
          </div>

          {loading && <p className="text-gray-500 text-sm mt-2">در حال جستجو...</p>}
          {!loading && results.length > 0 && (
            <ul className="max-h-64 overflow-y-auto text-sm mt-2 divide-y divide-gray-100">
              {results.map((product) => (
                <li key={product.id} className="py-2">
                  {product.name}
                </li>
              ))}
            </ul>
          )}

          {!loading && query.trim() && results.length === 0 && (
            <p className="text-gray-500 text-sm mt-2">نتیجه‌ای یافت نشد.</p>
          )}
        </div>
      </div>
    </>
  );
}
