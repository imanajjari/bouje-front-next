'use client';

import { useState } from 'react';
import { Ruler, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { addToCart } from '../../services/cart/cartService';
import { useRouter, useParams } from 'next/navigation';


type ProductBuyBoxProps = {
  title: string;
  price: string;
  variants: {
    id: number;
    color: { name: string; hex_code: string };
    size: string;
    stock: number;
  }[];
  sizeGuideLink: string;
};

export default function ProductBuyBox({
  title,
  price,
  variants,
  sizeGuideLink,
}: ProductBuyBoxProps) {
  const t = useTranslations("productDetail");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [stock, setStock] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const router = useRouter();
  const { locale } = useParams();

  const colors = [...new Set(variants.map(v => v.color.name))];

  const handleColorClick = (color: string) => {
    setSelectedColor(color);
    setSelectedSize(null);
    setStock(null);
    setQuantity(1);
  };

  const handleSizeClick = (size: string) => {
    setSelectedSize(size);
    const found = variants.find(v => v.color.name === selectedColor && v.size === size);
    setStock(found?.stock ?? null);
    setQuantity(1);
  };

  const handleAddToCart = async () => {
    if (!selectedColor || !selectedSize) {
      toast.error("لطفاً ابتدا رنگ و سایز را انتخاب کنید.");
      return;
    }

    const variant = variants.find(v => v.color.name === selectedColor && v.size === selectedSize);
    if (!variant) {
      toast.error("خطا در انتخاب محصول.");
      return;
    }

    if (quantity > (variant.stock ?? 0)) {
      toast.error("موجودی کافی نیست.");
      return;
    }

    try {
      await addToCart(variant.id, quantity);
      toast.success("محصول با موفقیت به سبد خرید اضافه شد.");
    } catch (error) {
      if (error?.message?.includes("Unauthorized")) {
        toast.error("برای افزودن به سبد خرید ابتدا وارد حساب کاربری شوید.");
        router.push(`/${locale}/auth/SignIn`);
      } else {
        toast.error("افزودن به سبد خرید با خطا مواجه شد.");
      }
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white border border-gray-200 p-6 space-y-6 text-right shadow">
      <div>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-lg text-gray-800">{price}</p>
      </div>

      {/* انتخاب رنگ */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">{t('hero.ColorSelection')}</p>
        <div className="flex flex-wrap gap-2">
          {[...new Map(variants.map(v => [v.color.name, v.color])).values()].map((color) => (
            <button
              key={color.name}
              onClick={() => handleColorClick(color.name)}
              className={`flex items-center gap-2 px-3 py-1 border rounded-full text-sm transition ${
                selectedColor === color.name
                  ? 'bg-black text-white border-black'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <span
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: color.hex_code }}
              ></span>
              {color.name}
            </button>
          ))}
        </div>
      </div>

      {/* انتخاب سایز */}
      {selectedColor && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">{t('hero.SizeSelection')}</p>
          <div className="flex flex-wrap gap-2">
            {[...new Set(variants.filter(v => v.color.name === selectedColor).map(v => v.size))].map((size) => (
              <button
                key={size}
                onClick={() => handleSizeClick(size)}
                className={`px-4 py-1 border rounded-full text-sm transition ${
                  selectedSize === size
                    ? 'bg-black text-white border-black'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* نمایش موجودی */}
      {stock !== null && (
        <p className={`text-sm mt-1 ${stock < 5 ? 'text-red-500' : 'text-gray-700'}`}>
          {t('hero.stock')} : {stock}
        </p>
      )}

      {/* انتخاب تعداد */}
      {stock !== null && (
        <div className="flex items-center justify-between border px-3 py-2 rounded-md w-36 mx-auto">
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="p-1 hover:text-red-600 transition"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity(q => Math.min(stock ?? 1, q + 1))}
            className="p-1 hover:text-green-600 transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* راهنمای سایز */}
      <div>
        <a
          href={sizeGuideLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm font-medium text-gray-700 hover:text-black transition"
        >
          <Ruler className="ml-2 w-4 h-4" />
          {t('hero.SizeGuide')}
        </a>
      </div>

      {/* دکمه افزودن به سبد خرید */}
      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: "#222", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}
        whileTap={{ scale: 0.95 }}
        onClick={handleAddToCart}
        className="w-full bg-black text-white py-3 rounded-sm font-bold transition"
      >
        {t('hero.AddToCart')}
      </motion.button>
    </div>
  );
}
