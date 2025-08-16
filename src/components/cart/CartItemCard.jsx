'use client';

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartItemCard({
  item,
  imageUrl,
  loading,
  t, // ترجمه‌های next-intl از صفحه والد پاس داده می‌شود
  onUpdateQuantity,
  onRemove,
  dir = "rtl",
}) {
  return (
    <div className="group" dir={dir}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
        <div className="p-4 md:p-8">
          {/* روی موبایل ستونی، از md به بعد افقی */}
          <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
            {/* تصویر محصول: واکنش‌گرا */}
            <div className="flex-shrink-0">
              <div className="relative overflow-hidden rounded-lg bg-gray-50 w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36">
                <Image
                  src={imageUrl}
                  alt={item.product_name}
                  fill
                  sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 144px"
                  className="object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            {/* جزئیات محصول */}
            <div className="flex-grow text-right w-full">
              <h2 className="text-lg sm:text-xl md:text-2xl font-light text-gray-900 mb-2 md:mb-3 tracking-wide">
                {item.product_name}
              </h2>

              <div className="space-y-1 md:space-y-2 mb-4 md:mb-6">
                <div className="flex justify-end items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{item.size}</span>
                  <span className="text-xs sm:text-sm text-gray-500">:{t("size")}</span>
                </div>
                <div className="flex justify-end items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{item.color}</span>
                  <span className="text-xs sm:text-sm text-gray-500">:{t("color")}</span>
                </div>
              </div>

              {/* کنترل تعداد + قیمت */}
              <div className="flex items-center justify-between md:justify-end gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="flex items-center gap-3 bg-gray-50 rounded-full px-3 py-1.5 md:px-4 md:py-2">
                  <button
                    disabled={loading}
                    onClick={() => onUpdateQuantity(item.variant, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 disabled:opacity-50 transition-colors"
                    aria-label={t("decrease")}
                  >
                    <Minus className="w-4 h-4 text-gray-700" />
                  </button>

                  <span className="font-medium text-gray-900 min-w-[20px] text-center">
                    {item.quantity}
                  </span>

                  <button
                    disabled={loading}
                    onClick={() => onUpdateQuantity(item.variant, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 disabled:opacity-50 transition-colors"
                    aria-label={t("increase")}
                  >
                    <Plus className="w-4 h-4 text-gray-700" />
                  </button>
                </div>

                <p className="text-base sm:text-lg md:text-xl font-medium text-gray-900">
                  {(item.product_price * item.quantity).toLocaleString("fa-IR")} تومان
                </p>
              </div>
            </div>

            {/* دکمه حذف */}
            <div className="md:flex-shrink-0 md:self-start self-center md:self-auto">
              <button
                onClick={() => onRemove(item.variant)}
                disabled={loading}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 disabled:opacity-50 transition-all duration-200"
                aria-label={t("remove")}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
