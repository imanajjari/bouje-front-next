"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

export default function ProductFilter({
  colors = [],
  categories = [],
  sizes = [],
  priceLimits,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeSection, setActiveSection] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const dropdownRef = useRef(null);

  const active = useMemo(
    () => ({
      q: searchParams.get("q") ?? "",
      category: searchParams.get("category") ?? "",
      color: searchParams.get("color") ?? "",
      size: searchParams.get("size") ?? "",
      min_price: searchParams.get("min_price") ?? "",
      max_price: searchParams.get("max_price") ?? "",
    }),
    [searchParams]
  );

  useEffect(() => {
    setMinPrice(active.min_price);
    setMaxPrice(active.max_price);
    setSearchQuery(active.q);
  }, [active.min_price, active.max_price, active.q]);

  // ✴️ کلیک بیرون برای بستن Dropdown
  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setActiveSection(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const updateParams = useCallback(
    (key, value) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value) params.delete(key);
      else params.set(key, value);
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams("q", searchQuery);
  };

  const clearFilters = () => {
    router.push(window.location.pathname, { scroll: false });
    setMinPrice("");
    setMaxPrice("");
    setSearchQuery("");
  };

  const removeFilter = (key) => {
    updateParams(key, "");
    if (key === "min_price") setMinPrice("");
    if (key === "max_price") setMaxPrice("");
    if (key === "q") setSearchQuery("");
  };

  const activeFilters = [];
  if (active.q)
    activeFilters.push({ key: "q", value: `جستجو: ${active.q}` });
  if (active.category)
    activeFilters.push({
      key: "category",
      value: categories.find((c) => c.slug === active.category)?.name || active.category,
    });
  if (active.color)
    activeFilters.push({ key: "color", value: active.color });
  if (active.size)
    activeFilters.push({ key: "size", value: active.size });
  if (active.min_price)
    activeFilters.push({ key: "min_price", value: `حداقل ${active.min_price} تومان` });
  if (active.max_price)
    activeFilters.push({ key: "max_price", value: `حداکثر ${active.max_price} تومان` });

  const toggleSection = (section) =>
    setActiveSection((prev) => (prev === section ? null : section));

  return (
    <aside className="w-full p-4 bg-white border-b border-gray-200 relative z-10" dir="rtl">
      {/* Search Section */}
      <div className="mb-4">
        <form onSubmit={handleSearchSubmit} className="relative max-w-md">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="جستجو در محصولات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pr-10 pl-4 py-2 border border-gray-300 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-sm"
          />
        </form>
      </div>

      {/* 🔸 فیلتر بالا */}
      <div className="flex justify-between items-center flex-wrap gap-2 mb-4">
        <div className="flex gap-3 flex-wrap">
          {[
            { id: "category", label: "دسته‌بندی" },
            { id: "color", label: "رنگ" },
            ...(sizes.length ? [{ id: "size", label: "سایز" }] : []),
            { id: "price", label: "قیمت" },
          ].map(({ id, label }) => (
            <div key={id} className="relative" ref={id === activeSection ? dropdownRef : null}>
              <button
                onClick={() => toggleSection(id)}
                className={`text-sm px-3 py-1 border rounded-full transition 
                  ${activeSection === id ? "bg-gray-200" : "bg-gray-100 hover:bg-gray-200"}`}
              >
                {label}
              </button>

              {/* ▾ dropdown */}
              {activeSection === id && (
                <div
                  className="absolute top-11 right-0 bg-white border border-gray-300 shadow-lg rounded-lg p-4 min-w-[200px] w-max z-50"
                  style={{ maxWidth: "300px" }}
                >
                  {id === "category" && (
                    <ul className="space-y-2 text-sm">
                      {categories.map((c) => (
                        <li key={c.name}>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="category"
                              checked={active.category === c.name}
                              onChange={() =>
                                updateParams("category", active.category === c.name ? "" : c.name)
                              }
                              className="accent-orange-500"
                            />
                            <span>{c.name}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}

                  {id === "color" && (
                    <div className="flex flex-wrap gap-2">
                      {colors.map((clr) => (
                        <button
                          key={clr.name}
                          title={clr.name}
                          onClick={() =>
                            updateParams("color", active.color === clr.name ? "" : clr.name)
                          }
                          className={`w-7 h-7 rounded-full border-2 transition 
                            ${active.color === clr.name ? "border-orange-600" : "border-gray-300"}`}
                          style={{ backgroundColor: clr.hex_code }}
                        />
                      ))}
                    </div>
                  )}

                  {id === "size" && (
                    <div className="flex flex-wrap gap-2 text-sm">
                      {sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() =>
                            updateParams("size", active.size === s ? "" : s)
                          }
                          className={`px-2 py-1 border rounded 
                            ${
                              active.size === s
                                ? "bg-orange-500 text-white border-orange-500"
                                : "border-gray-300"
                            }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}

                  {id === "price" && (
                    <div className="flex flex-col gap-2 text-sm">
                      <input
                        type="number"
                        placeholder="حداقل"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        onBlur={() => updateParams("min_price", minPrice)}
                        className="border rounded px-2 py-1"
                      />
                      <input
                        type="number"
                        placeholder="حداکثر"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        onBlur={() => updateParams("max_price", maxPrice)}
                        className="border rounded px-2 py-1"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={clearFilters}
          className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full"
        >
          پاک‌کردن همه
        </button>
      </div>

      {/* 🔹 نمایش فیلترهای فعال */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {activeFilters.map((filter) => (
            <div
              key={filter.key}
              className="flex items-center gap-1 bg-orange-100 text-orange-800 text-sm px-2 py-1 rounded-full"
            >
              <span>{filter.value}</span>
              <button
                onClick={() => removeFilter(filter.key)}
                className="text-orange-600 hover:text-orange-800"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
