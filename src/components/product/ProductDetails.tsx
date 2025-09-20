import { Globe } from 'lucide-react';
import MediaModal from '../modal/MediaModal';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

type MediaItem = {
  type: 'image' | 'video' | 'file';
  image: string;
  alt_text?: string;
  name?: string;
};

type ProductDetailsProps = {
  productImage: string;
  commitmentText: string;
  productCode: string;
  description: string;
  features: string[];
  onPrint?: () => void;
  pdfFile?: string;
  mediaItems: MediaItem[];
};

export default function ProductDetails({
  productImage,
  commitmentText,
  productCode,
  description,
  features,
  onPrint,
  pdfFile,
  mediaItems,
}: ProductDetailsProps) {
  const t = useTranslations('productDetail');

  return (
    <div className="border border-gray-300 p-8 space-y-8 text-right max-w-2xl mx-auto bg-white">
      <div className="flex justify-center">
        <div className="relative w-56 h-56">
          <Image
            src={productImage}
            alt="Product"
            fill
            className="object-contain"
            sizes="224px"
            priority
          />
        </div>
      </div>

      <div className="text-center space-y-2">
        <Globe className="w-8 h-8 mx-auto text-gray-700" />
        {pdfFile ? (
          <a
            href={pdfFile}
            download
            className="underline text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            {commitmentText}
          </a>
        ) : (
          <p className="underline text-sm font-medium text-gray-500">
            {commitmentText}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold">{t('productDetails')}</h2>
        <p className="text-gray-700 text-sm">{productCode}</p>
        <p className="text-gray-700 text-sm leading-relaxed">{description}</p>

        <ul className="list-disc pr-5 space-y-1 text-sm text-gray-700 mt-3">
          {features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>

        {/* اگر لازم شد پرینت را فعال کن */}
        {/* {onPrint && (
          <button
            onClick={onPrint}
            className="underline text-sm text-black hover:text-gray-600 mt-4"
          >
            پرینت
          </button>
        )} */}
      </div>

      <div>
        <MediaModal mediaItems={mediaItems} />
      </div>
    </div>
  );
}
