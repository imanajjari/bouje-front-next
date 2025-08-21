// app/[locale]/products/[slug]/page.jsx   ← مسیر شما که log داده بود
import Footer from "../../../../components/common/Footer";
import Header from "../../../../components/common/Header";
import ProductCarousel from "../../../../components/home/ProductCarousel";
import ProductShowcaseBanner from "../../../../components/product/ProductShowcaseBanner";
import ProductBuyBox from "../../../../components/product/ProductBuyBox";
import ProductAccordion from "../../../../components/accordion/ProductAccordion";
import ProductDetails from "../../../../components/product/ProductDetails";
import PopularProductsSlider from "../../../../components/product/PopularProductsSlider";
import MediaModal from "../../../../components/modal/MediaModal";
import { getProductDetail } from "../../../../app/[locale]/api/product/getProductDetail";
import { productService } from "../../../../services/product/productService";
import { mapRelatedProductsToCarousel } from "../../../../utils/products/mapRelatedProductsToCarousel";
import { useJalaliDateServer } from "../../../../utils/dates/useJalaliDateServer";

export default async function Page({ params }) {
  const { locale, slug } = await params;

  const product = await getProductDetail(slug);
  const related = await productService.getRelatedProducts(product.id);
  const relatedProducts = mapRelatedProductsToCarousel(related, locale);

  const jalaliDate = useJalaliDateServer(product?.display_date);

  const mediaItems = (product.modals || []).map((item) => {
    const ext = item.image.split(".").pop()?.toLowerCase();
    const isImg = ["jpg","jpeg","png","webp","gif","svg"].includes(ext || "");
    const isVid = ["mp4","mov","webm","avi"].includes(ext || "");
    return {
      type: isImg ? "image" : isVid ? "video" : "file",
      image: item.image,
      alt_text: item.alt_text || "",
      name: item.name || item.image.split("/").pop(),
    };
  });

  return (
    <div className="flex flex-col min-h-screen bg-white" dir="rtl">
      <Header logoAnimation={false} iconColor="#000000" stickOnScrollOnly />

      <div className="bg-[#E7E7E7] py-6">
        <ProductShowcaseBanner images={product.images}>
          <ProductBuyBox
            title={product.name}
            price={product.price}
            variants={product.variants}
            sizeGuideLink={product.size_guide?.file}
            productId={product.id}
          />
        </ProductShowcaseBanner>
      </div>

      <div className="flex justify-around w-full p-5 gap-5">
        <MediaModal mediaItems={mediaItems} />
      </div>

      <div className="flex justify-around w-full p-5 gap-5">
        <div className="w-full md:w-1/2">
          <ProductAccordion items={product.faqs} />
        </div>

        <div className="hidden md:block">
          <ProductDetails
            productImage={product.image}
            commitmentText={"شناسه محصول"}
            productCode={`شناسه محصول ${product.product_code}`}
            description={product.description}
            features={[
              product.material,
              product.made_in,
              jalaliDate,
              product.display_date,
              ...(product.features?.split(",") || []),
            ]}
            pdfFile={product.pdf_file}
          />
        </div>
      </div>

      <div className="p-5">
        <h2 className="text-center mb-5 text-2xl">قطعاً عاشقش می‌شی</h2>
        <ProductCarousel
          products={relatedProducts}
          slidesPerView={{ default: 2, spacing: 10 }}
          breakpoints={{
            "(min-width: 768px)": { perView: 3, spacing: 40 },
            "(min-width: 1024px)": { perView: 5, spacing: 60 },
          }}
          blur={{ active: 0, adjacent: 0, others: 0 }}
          opacity={{ active: 1, adjacent: 1, others: 1 }}
          autoPlay
          autoPlayInterval={6000}
          showTitleMode="all"
          showPrice
          showArrows
        />
      </div>

      <div className="py-2 md:p-5">
        <PopularProductsSlider
          slidesPerView={{ default: 2, spacing: 0 }}
          breakpoints={{
            "(min-width: 768px)": { perView: 4, spacing: 0 },
            "(min-width: 1024px)": { perView: 5, spacing: 0 },
          }}
          autoPlay={false}
          autoPlayInterval={5000}
          showTitle
          showPrice
        />
      </div>

      <Footer />
    </div>
  );
}
