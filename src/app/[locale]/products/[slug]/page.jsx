'use client';

import Footer from "../../../../components/common/Footer";
import Header from "../../../../components/common/Header";
import ProductCarousel from '../../../../components/home/ProductCarousel';
import { useEffect, useState } from "react";
import ProductShowcaseBanner from "../../../../components/product/ProductShowcaseBanner";
import ProductBuyBox from "../../../../components/product/ProductBuyBox";
import ProductAccordion from "../../../../components/accordion/ProductAccordion";
import ProductDetails from "../../../../components/product/ProductDetails";
import RecentlyViewedSlider from "../../../../components/product/RecentlyViewedSlider";
import PopularProductsSlider from "../../../../components/product/PopularProductsSlider";
import { getProductDetail } from "../../../../app/[locale]/api/product/getProductDetail";
import { useParams, usePathname } from "next/navigation";
import { useJalaliDate } from "../../../../hooks/useJalaliDate";
import { addToCart } from "../../../../app/[locale]/api/Cart/cart";
import MediaModal from "../../../../components/modal/MediaModal";
import { useTranslations } from "next-intl";
import ReadingProgress from "../../../../components/magazine/ReadingProgress";
import { productService } from "../../../../services/product/productService";
import { mapRelatedProductsToCarousel } from "../../../../utils/products/mapRelatedProductsToCarousel";

export default function Home() {
  const params = useParams();
  const slug = params?.slug;
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const t = useTranslations("productDetail");

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const parseMediaItems = (rawItems) => {
    return rawItems.map((item) => {
      const ext = item.image.split('.').pop()?.toLowerCase();
      let type = 'file';
      if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext || '')) {
        type = 'image';
      } else if (['mp4', 'mov', 'webm', 'avi'].includes(ext || '')) {
        type = 'video';
      }
      return {
        type,
        image: item.image,
        alt_text: item.alt_text || '',
        name: item.name || item.image.split('/').pop(),
      };
    });
  };

  const jalaliDate = useJalaliDate(product?.display_date);

  useEffect(() => {
    if (!slug) return;
  
    getProductDetail(slug)
      .then((product) => {
        setProduct(product);
  
        return productService.getRelatedProducts(product.id);
      })
      .then((related) => {
        const suggested = mapRelatedProductsToCarousel(related, locale);
        setRelatedProducts(suggested);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [slug]);
  
  

  if (loading) return <div>در حال بارگذاری...</div>;
  if (error) return <div>{error}</div>;

  const handleAddToCart = async (selectedSize) => {
    if (!selectedSize) {
      alert("لطفاً ابتدا سایز را انتخاب کنید.");
      return;
    }

    try {
      await addToCart({
        product_id: product.id,
        quantity: 1,
        size: selectedSize,
      });

      alert("محصول با موفقیت به سبد خرید اضافه شد.");
    } catch (error) {
      alert("خطا در افزودن به سبد خرید: " + error.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white" dir="rtl">
      <Header logoAnimation={false} iconColor="#000000" stickOnScrollOnly={true} />
{/* Reading Progress Indicator */}
            <ReadingProgress />
      <div className="mt-12 bg-[#E7E7E7] py-6">
        <ProductShowcaseBanner images={product.images}>
          <ProductBuyBox
            title={product.name}
            price={product.price}
            variants={product.variants}
            sizeGuideLink={product.size_guide?.file}
            onAddToCart={handleAddToCart}
          />
        </ProductShowcaseBanner>
      </div>

      <div className="flex justify-around w-full p-5 gap-5">


        <MediaModal
          mediaItems={parseMediaItems(product.modals || [])}
        />
      </div>

      <div className="flex justify-around w-full p-5 gap-5">
        <div className="w-full md:w-1/2">
          <ProductAccordion items={product.faqs} />
        </div>

        <div className="hidden md:block">
          <ProductDetails
            productImage={product.image}
            commitmentText={t('productID')}
            productCode={`${t('productID')} ${product.product_code}`}
            description={product.description}
            features={[
              product.material,
              product.made_in,
              jalaliDate,
              product.display_date,
              ...(product.features?.split(',') || []),
            ]}
            pdfFile={product.pdf_file}
            onPrint={() => window.print()}
            mediaItems={parseMediaItems(product.modals || [])}
          />
        </div>
      </div>

       <div className="p-5">
        <h2 className="text-center mb-5 text-2xl">{t('youWillDefinitelyLoveIt')}</h2>
        <ProductCarousel
    products={relatedProducts}
    slidesPerView={{ default: 2, spacing: 10 }}
    breakpoints={{
      '(min-width: 768px)': { perView: 3, spacing: 40 },
      '(min-width: 1024px)': { perView: 5, spacing: 60 },
    }}
    blur={{ active: 0, adjacent: 0, others: 0 }}
    opacity={{ active: 1, adjacent: 1, others: 1 }}
    autoPlay={true}
    autoPlayInterval={6000}
    showTitleMode="all"
    showPrice={true}
    showArrows={true}
  />
{/*
        <div className="py-2 md:p-5">
          <RecentlyViewedSlider
            items={[
              { title: 'کیف زنانه گوچی', image: '/images/782741_FAEHB_6207_001_100_0000_Light-Large-embossed-canvas-tote-bag.avif', price: '۹۵۰ دلار' },
              { title: 'کیف زنانه گوچی', image: '/images/822870_FAEF8_8798_001_100_0000_Light-Embroidered-large-canvas-pouch.avif', price: '۹۵۰ دلار' },
              { title: 'کیف زنانه گوچی', image: '/images/782741_FAEHB_6207_001_100_0000_Light-Large-embossed-canvas-tote-bag.avif', price: '۹۵۰ دلار' },
              { title: 'کیف زنانه گوچی', image: '/images/822870_FAEF8_8798_001_100_0000_Light-Embroidered-large-canvas-pouch.avif', price: '۹۵۰ دلار' },
              { title: 'کیف زنانه گوچی', image: '/images/782741_FAEHB_6207_001_100_0000_Light-Large-embossed-canvas-tote-bag.avif', price: '۹۵۰ دلار' },
              { title: 'کیف زنانه گوچی', image: '/images/822870_FAEF8_8798_001_100_0000_Light-Embroidered-large-canvas-pouch.avif', price: '۹۵۰ دلار' },
            ]}
            slidesPerView={{ default: 2, spacing: 0 }}
            breakpoints={{
              '(min-width: 768px)': { perView: 4, spacing: 0 },
              '(min-width: 1024px)': { perView: 5, spacing: 0 },
            }}
            autoPlay={false}
            autoPlayInterval={5000}
            showTitle={true}
            showPrice={true}
          />
        </div>
       */}
       </div>
<div className="py-2 md:p-5">
<PopularProductsSlider
  slidesPerView={{ default: 2, spacing: 0 }}
  breakpoints={{
    '(min-width: 768px)': { perView: 4, spacing: 0 },
    '(min-width: 1024px)': { perView: 5, spacing: 0 },
  }}
  autoPlay={false}
  autoPlayInterval={5000}
  showTitle={true}
  showPrice={true}
/>

</div>
      <Footer />
    </div>
  );
}
