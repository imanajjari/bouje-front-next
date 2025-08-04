/* components/orders/OrderCard.jsx */
"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Truck,
  Clock,
  CheckCircle2,
  MapPin,
  Calendar,
  Package,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { API_BASE_URL } from "../../app/[locale]/api/config";
import SupportModal from "../common/SupportModal";

/* 🟡 استایل وضعیت‌ها */
const statusStyles = {
  preparing: {
    label: "در حال آماده‌سازی",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
    icon: <Clock className="w-4 h-4" />,
  },
  shipped: {
    label: "در حال ارسال",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    icon: <Truck className="w-4 h-4" />,
  },
  delivered: {
    label: "ارسال شده",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
};

function formatDateTime(iso, locale = "fa") {
  if (!iso) return "—";
  const dt = new Date(iso);
  /* به‌سادگی سه نگاشت اصلی برای مثال */
  const map = { fa: "fa-IR", en: "en-US", ar: "ar-EG" };
  return new Intl.DateTimeFormat(map[locale] ?? "fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dt);
}

function formatNumber(n, locale = "fa") {
  const map = { fa: "fa-IR", en: "en-US", ar: "ar-EG" };
  return new Intl.NumberFormat(map[locale] ?? "fa-IR").format(Number(n));
}

/**
 * @param {{ order: any, locale?: "fa"|"en"|"ar" }} props
 */
export default function OrderCard({ order, locale = "fa" }) {
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  /* 🔹 وضعیت ارسال */
  const shipStatus = statusStyles[order.shipping_status] ?? statusStyles.preparing;

  return (
    <div className="bg-white shadow-lg border border-gray-100 hover:border-blue-100 transition-all duration-300 w-full overflow-hidden font-sans rtl">
      {/* هدر کارت */}
      <div className="bg-gradient-to-l from-blue-50 to-indigo-50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Package className="text-blue-600 w-5 h-5" />
          <span className="text-blue-900 font-bold">سفارش #{order.id}</span>
        </div>
        <div
          className={`flex items-center gap-1.5 py-1 px-3 rounded-full ${shipStatus.bgColor} ${shipStatus.textColor} ${shipStatus.borderColor} text-xs font-medium`}
        >
          {shipStatus.icon}
          <span>{shipStatus.label}</span>
        </div>
      </div>

      {/* بدنه */}
      <div className="p-6">
        {/* اطلاعات اصلی */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-3 flex-1">
            <h2 className="text-xl font-bold text-gray-900">{order.full_name || "—"}</h2>

            <div className="flex items-start gap-2 text-gray-600">
              <MapPin className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
              <p className="text-sm">{order.address}</p>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <p className="text-sm">{formatDateTime(order.delivery_time, locale)}</p>
            </div>
          </div>

          {/* تصویرهای خلاصه در حالت بسته */}
          {!isOpen && (
            <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
              {order.items.slice(0, 2).map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-gray-50 rounded-xl p-1.5 border border-gray-100"
                >
                  <img
                    src={
                      item.product_image?.startsWith("http")
                        ? item.product_image
                        : `${API_BASE_URL}${item.product_image}`
                    }
                    alt={item.product_name}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <span className="text-xs text-gray-700 max-w-[100px] truncate">
                    {item.product_name}
                  </span>
                </div>
              ))}
              {order.items.length > 2 && (
                <div className="flex items-center justify-center bg-blue-50 text-blue-700 rounded-xl p-2 border border-blue-100">
                  <span className="text-xs font-medium">+{order.items.length - 2}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* دکمه باز/بستن جزئیات */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
          >
            {isOpen ? "بستن جزئیات" : "مشاهده جزئیات"}
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* جزئیات */}
        <div
          className={`mt-6 overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-dashed border-gray-200 pt-6">
            {/* محصولات */}
            <h3 className="text-md font-bold text-gray-800 flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-blue-500" />
              محصولات سفارش
            </h3>

            <ul className="space-y-3">
              {order.items.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-blue-50 rounded-2xl transition-colors duration-200 border border-gray-100 hover:border-blue-200"
                >
                  <img
                    src={
                      item.product_image?.startsWith("http")
                        ? item.product_image
                        : `${API_BASE_URL}${item.product_image}`
                    }
                    alt={item.product_name}
                    className="w-16 h-16 object-cover rounded-xl border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 mb-1">{item.product_name}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <span>تعداد: {formatNumber(item.quantity, locale)}</span>
                      <span>
                        قیمت واحد: {formatNumber(item.price, locale)} تومان
                      </span>
                    </div>
                  </div>
                  {/* <Link
                    
                    href={`/${locale}/products/${item.variant_id}`}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link> */}
                </li>
              ))}
            </ul>

            {/* اطلاعات تکمیلی */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">وضعیت پرداخت</p>
                <p className="font-medium text-gray-800">{order.payment_status}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">مجموع قیمت</p>
                <p className="font-medium text-gray-800">
                  {formatNumber(order.total_amount, locale)} تومان
                </p>
              </div>
            </div>
          </div>

          {/* دکمه‌های عملیات */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center sm:justify-end">
            {/* <button className="flex-1 sm:flex-none bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-3 rounded-xl font-medium transition-colors">
              لغو سفارش
            </button> */}
<button
  onClick={() => setIsSupportOpen(true)}
  className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
>
  <Truck className="w-4 h-4" />
  پیگیری سفارش
</button>
          </div>
        </div>
      </div>
      <SupportModal
  show={isSupportOpen}
  onClose={() => setIsSupportOpen(false)}
/>
    </div>
  );
}
