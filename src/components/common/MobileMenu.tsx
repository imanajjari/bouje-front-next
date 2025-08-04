import Link from "next/link";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Logo from "../../components/common/Logo";
import { useTranslations } from "next-intl";
import { fetchPdfCollection } from "../../services/pdf/pdfService";
import { AnimatePresence, motion } from "framer-motion";

export default function MobileMenu({
  open,
  onClose,
  locale,
}: {
  open: boolean;
  onClose: () => void;
  locale: string;
}) {
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfs, setPdfs] = useState([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("navbar");

  const links = [
    { href: `/${locale}/`, label: t("index") },
    { href: `/${locale}/products`, label: t("shop") },
    { href: `/${locale}/magazine`, label: t("magazine") },
    { href: `/${locale}/about-us`, label: t("about-us") },
    { href: `/${locale}/contact-us`, label: t("contact-us") },
  ];

  useEffect(() => {
    fetchPdfCollection(locale).then((data) => {
      if (data?.items) setPdfs(data.items);
    });
  }, [locale]);

  useEffect(() => {
    const menu = menuRef.current;
    function handleTransitionEnd() {
      if (open) {
        setShowCloseButton(true);
        setShowLinks(true);
      }
    }
    if (menu) {
      menu.addEventListener("transitionend", handleTransitionEnd);
    }
    return () => {
      if (menu) {
        menu.removeEventListener("transitionend", handleTransitionEnd);
      }
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setShowCloseButton(false);
      setShowLinks(false);
      setPdfOpen(false);
    }
  }, [open]);

  return (
    <>
      <div
        ref={menuRef}
        className={`fixed z-50 bg-white shadow-lg transform transition-transform duration-500 ease-in-out
          w-full md:w-80 h-full bottom-0 left-0 md:top-0 md:right-0 md:left-auto
          ${open ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between p-4">
          <div className="w-32">
            <Logo className="w-full" fillColor="#434343FF" />
          </div>
          <button
            className={`text-white hover:opacity-70 transition p-3 rounded-full ${
              showCloseButton ? "bg-black" : "bg-white"
            }`}
            onClick={onClose}
            aria-label="Close Menu"
          >
            <X size={24} color="#FFFFFF" />
          </button>
        </div>

        <nav className="flex flex-col p-4 gap-4 text-black font-medium">
          {links.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`transform transition-all duration-500 text-xl ${
                showLinks ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              {link.label}
            </Link>
          ))}

          {/* گزینه PDF + انیمیشن کشویی */}
          <div>
{/* آیتم "بیش‌تر" با انیمیشن دقیقاً مشابه بقیه */}
<button
  onClick={() => setPdfOpen((prev) => !prev)}
  className={`flex items-center justify-between w-full text-xl transition-all
    ${showLinks ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}
  `}
  style={{ transitionDelay: `${links.length * 100}ms` }}
>
  <span className="flex items-center gap-2">
    {t("more") || "بیش‌تر"}
  </span>
  {pdfOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
</button>

{/* زیربخش PDFها فقط بعد از باز شدن "بیش‌تر" */}
<AnimatePresence initial={false}>
  {pdfOpen && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="overflow-hidden pl-4 flex flex-col gap-3 mt-2"
    >
      {pdfs.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + index * 0.05 }}
        >
          <Link
            href={`/${locale}/pdf-viewer/${item.id}`}
            onClick={onClose}
            className="text-base text-gray-700 hover:text-black transition"
          >
            {item.title}
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )}
</AnimatePresence>

          </div>
        </nav>
      </div>

      {/* بک‌دراپ نیمه شفاف */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={onClose}
        ></div>
      )}
    </>
  );
}
