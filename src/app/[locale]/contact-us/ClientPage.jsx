"use client";

import { useEffect, useState } from "react";
import {
  Phone, Mail, MapPin, Send, Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Header from "../../../components/common/Header";
import Footer from "../../../components/common/Footer";
import HeroBanner from "../../../components/common/HeroBanner";
import ContactStructuredData from "../../../components/common/seo/ContactStructuredData";
import { Toaster, toast } from "sonner";
import {
  getContactPageData,
  sendContactMessage,
} from "../../../services/contact/contactService";
import MapEmbed from "../../../services/contact/MapEmbed";

const dayNames = {
  fa: ["شنبه","یک‌شنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنج‌شنبه","جمعه"],
  en: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
  ar: ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],
};

const infoIcon = {
  phone:   <Phone className="w-8 h-8 mx-auto text-black" />,
  email:   <Mail className="w-8 h-8 mx-auto text-black" />,
  address: <MapPin className="w-8 h-8 mx-auto text-black" />,
};

export default function ContactPage() {
  const locale = useLocale();
  const t = useTranslations("contact");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ full_name: "", email: "", message: "" });

  useEffect(() => {
    (async () => {
      try {
        const d = await getContactPageData(locale);
        setData(d);
      } catch (err) {
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [locale]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.message) {
      toast.error(t("toast.incomplete"));
      return;
    }
    const res = await sendContactMessage(form);
    if (res?.error) {
      toast.error(t("toast.error"));
    } else {
      toast.success(t("toast.success"));
      setForm({ full_name: "", email: "", message: "" });
    }
  }

  if (loading) {
    return (
      <>
        <Header logoAnimation={false} iconColor="#000000" stickOnScrollOnly={true} />
        <main className="flex items-center justify-center min-h-screen">
          <span className="animate-pulse text-gray-500">Loading…</span>
        </main>
        <Footer />
      </>
    );
  }

  const hero = data?.hero ?? {};
  const info_items = Array.isArray(data?.info_items) ? data.info_items : [];
  const map = data?.map ?? null;
  const working_hours = Array.isArray(data?.working_hours) ? data.working_hours : [];

  const workingData = working_hours.map((d) => {
    const day = dayNames[locale]?.[d.day_index] ?? "-";
    const closed = !d.is_active;
    const time = closed
      ? (locale === "fa" ? "تعطیل" : locale === "ar" ? "مغلق" : "Closed")
      : (locale === "fa"
          ? `${d.from_time.slice(0,5)} تا ${d.to_time.slice(0,5)}`
          : `${d.from_time.slice(0,5)} – ${d.to_time.slice(0,5)}`);
    return { day, time, closed };
  });

  let mapSrc = "";
  if (map?.provider === "neshan" && map?.lat && map?.lng) {
    const zoom = map?.zoom || 15;
    mapSrc = `https://map.neshan.org/?marker=${map.lat},${map.lng}&zoom=${zoom}&type=neshan`;
  } else {
    mapSrc = map?.embed_url || "";
  }

  return (
    <>
      <Header logoAnimation={false} iconColor="#000000" stickOnScrollOnly={true} />
      {hero && <HeroBanner imageSrc={hero.background} title={hero.title} description={hero.subtitle} fallbackColor="#FFFFFFFF" />}
      <ContactStructuredData data={data} />
      <Toaster richColors position="top-center" />

      <main className="bg-white text-black font-sans min-h-screen">
        <section className="py-20 px-6 max-w-7xl mx-auto text-center">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-3xl font-bold mb-12">
            {t("contactPlane.title")}
          </motion.h2>
          {info_items.length > 0 && (
            <div className="grid md:grid-cols-3 gap-10">
              {info_items.map(({ item_type, value }, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }} viewport={{ once: true }} className="border border-gray-200 p-8 rounded-xl shadow-sm bg-gray-50">
                  {infoIcon[item_type] ?? infoIcon.phone}
                  <h3 className="font-bold text-lg mt-4">{t(`contactPlane.${item_type}`)}</h3>
                  <p className="text-sm text-gray-600 mt-2 break-words">{value}</p>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {data.map.embed_code && (
          <section className="my-10 px-4 md:px-10 flex flex-col justify-center items-center">
  <h2 className="text-2xl font-semibold mb-4">موقعیت مکانی</h2>
  <MapEmbed embedCode={data.map.embed_code} />
</section>
        )}

        <section className="py-24 px-6 bg-black text-white">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-3xl font-extrabold mb-10">
              {t("form.title")}
            </motion.h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 text-left">
              <div>
                <label className="block text-sm mb-1">{t("form.fullNameLbl")}</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl bg-white text-black border border-white/20 focus:outline-none" placeholder={t("form.fullNamePH")}
                  value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm mb-1">{t("form.emailLbl")}</label>
                <input type="email" className="w-full px-4 py-3 rounded-xl bg-white text-black border border-white/20 focus:outline-none" placeholder="example@email.com"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm mb-1">{t("form.messageLbl")}</label>
                <textarea rows="5" className="w-full px-4 py-3 rounded-xl bg-white text-black border border-white/20 focus:outline-none" placeholder={t("form.messagePH")}
                  value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <div className="text-center mt-6">
                <button type="submit" className="inline-flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-xl hover:bg-gray-200 transition">
                  {t("form.txtButton")}
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </section>

        {workingData.length > 0 && (
          <section className="py-20 px-6 max-w-5xl mx-auto">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center text-3xl font-bold mb-12">
              {t("OurWorkingHours")}
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {workingData.map(({ day, time, closed }, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                  className={`rounded-xl p-6 shadow-sm text-center border ${closed ? "bg-gray-100 text-gray-500 border-gray-200 line-through" : "bg-white text-black border-black/10"}`}>
                  <Clock className="w-6 h-6 mx-auto mb-3" />
                  <h4 className="font-semibold text-lg">{day}</h4>
                  <p className="text-sm mt-1">{time}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
