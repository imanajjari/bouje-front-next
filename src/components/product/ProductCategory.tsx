"use client";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronUp, Minus, Search } from "lucide-react";

export default function CategoryList({ categories = [], locale = "fa" ,title="Collections"}) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  if (!categories.length) return null;

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleCategories = filteredCategories;

  return (
    <div className="bg-white  overflow-hidden transition-all duration-500" dir="rtl">
      {/* Elegant Header */}
      <div className="bg-black px-8 py-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black opacity-90"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="text-center flex-1">
            <h2 className="text-xl font-light text-white tracking-[0.2em] uppercase">
              {title}
            </h2>
            <div className="w-16 h-px bg-white mx-auto mt-2 opacity-60"></div>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:text-gray-300 transition-colors duration-300 font-light text-sm tracking-wide flex items-center gap-2"
          >
            {isCollapsed ? (
              <>
                <span>گسترش</span>
                <ChevronDown size={16} />
              </>
            ) : (
              <>
                <span>جمع کردن</span>
                <ChevronUp size={16} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className={`bg-gray-50 transition-all duration-700 ease-in-out ${isCollapsed ? 'max-h-0 opacity-0 overflow-hidden' : 'max-h-screen opacity-100'}`}>
        <div className="px-8 py-6">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="جستجو در مجموعه‌ها..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pr-10 pl-4 py-3 border border-gray-300 rounded-none bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 font-light text-sm tracking-wide"
            />
          </div>
          
          {/* Search Results Counter */}
          {searchTerm && (
            <div className="text-center mt-4">
              <span className="text-xs text-gray-600 font-light tracking-wide">
                {filteredCategories.length} مجموعه یافت شد
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Categories Grid */}
      <div className={`bg-white transition-all duration-700 ease-in-out ${isCollapsed ? 'max-h-0 opacity-0 overflow-hidden' : 'max-h-screen opacity-100'}`}>
        {visibleCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {visibleCategories.map((category, index) => (
              <div
                key={category.slug}
                className="group relative border-b border-r border-gray-100 last:border-r-0 md:last:border-r lg:last:border-r-0"
                onMouseEnter={() => setHoveredCategory(category.slug)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <Link
                  href={`/${locale}/products/category/${category.slug}`}
                  className="block px-8 py-12 h-full transition-all duration-500 hover:bg-gray-50 relative overflow-hidden"
                >
                  {/* Luxury Number Badge */}
                  <div className="absolute top-4 right-4 w-8 h-8 border border-gray-300 flex items-center justify-center">
                    <span className="text-xs font-light text-gray-600">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Category Content */}
                  <div className="text-center space-y-6">
                    {/* Elegant Separator */}
                    <div className="flex items-center justify-center">
                      <div className="w-8 h-px bg-gray-300 group-hover:bg-black transition-all duration-500"></div>
                      <Minus size={16} className="mx-2 text-gray-400 group-hover:text-black transition-all duration-500" />
                      <div className="w-8 h-px bg-gray-300 group-hover:bg-black transition-all duration-500"></div>
                    </div>

                    {/* Category Name */}
                    <h3 className="text-lg font-light text-gray-800 tracking-wide group-hover:text-black transition-all duration-300 uppercase">
                      {category.name}
                    </h3>

                    {/* Product Count */}
                    {category.count && (
                      <div className="text-xs text-gray-500 font-light tracking-[0.1em] uppercase">
                        {category.count} محصول
                      </div>
                    )}

                    {/* Subtle Underline */}
                    <div className="w-12 h-px bg-gray-200 mx-auto group-hover:w-16 group-hover:bg-black transition-all duration-500"></div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </Link>

                {/* Side Accent Line */}
                <div className="absolute right-0 top-0 w-px h-full bg-gray-200 group-hover:bg-black transition-all duration-500"></div>
              </div>
            ))}
          </div>
        ) : (
          searchTerm && (
            <div className="text-center py-16">
              <div className="space-y-4">
                <Search className="h-12 w-12 text-gray-300 mx-auto" />
                <h3 className="text-lg font-light text-gray-600">موردی یافت نشد</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  هیچ مجموعه‌ای با عبارت &quot;{searchTerm}&quot; یافت نشد. لطفاً کلمه کلیدی دیگری امتحان کنید.
                </p>
              </div>
            </div>
          )
        )}

        {/* Expand/Collapse Section */}
        <div className={`border-t border-gray-100 bg-gray-50 transition-all duration-700 ${isCollapsed ? 'max-h-0 opacity-0 overflow-hidden' : 'max-h-screen opacity-100'}`}>
          <div className="text-center py-8">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="group inline-flex items-center gap-4 px-12 py-4 bg-white border border-gray-300 hover:bg-black hover:text-white hover:border-black transition-all duration-500 font-light text-sm tracking-[0.1em] uppercase"
            >
              <div className="w-6 h-px bg-gray-400 group-hover:bg-white transition-all duration-500"></div>
              <span>جمع کردن مجموعه‌ها</span>
              <ChevronUp size={16} />
              <div className="w-6 h-px bg-gray-400 group-hover:bg-white transition-all duration-500"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Elegant Footer */}
      <div className="bg-black px-8 py-4">
        <div className="flex items-center justify-between text-xs text-gray-400 font-light tracking-wide">
          <span className="uppercase">
            {searchTerm ? `نمایش: ${filteredCategories.length} از ${categories.length} مجموعه` : `مجموع: ${categories.length} مجموعه`}
          </span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-px bg-gray-600"></div>
            <span className="uppercase">Luxury Collections</span>
            <div className="w-4 h-px bg-gray-600"></div>
          </div>
        </div>
      </div>
    </div>
  );
}