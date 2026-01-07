"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Toaster, toast } from "sonner";
import { Phone, Mail, MapPin, Send, Clock } from "lucide-react";

import Header from "../../../components/common/Header";
import Footer from "../../../components/common/Footer";
import HeroBanner from "../../../components/common/HeroBanner";
import ContactStructuredData from "../../../components/common/seo/ContactStructuredData";

import {
  getContactPageData,
  sendContactMessage,
} from "../../../services/contact/contactService";

import MapEmbed from "../../../services/contact/MapEmbed";

const dayNames = {
  fa: ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  ar: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
};

const infoIcon = {
  phone: <Phone className="w-8 h-8 mx-auto text-black" />,
  email: <Mail className="w-8 h-8 mx-auto text-black" />,
  address: <MapPin className="w-8 h-8 mx-auto text-black" />,
};

function safeStr(v) {
  return typeof v === "string" ? v : "";
}

export default function ClientPage() {
  const locale = useLocale();
  const t = useTranslations("contact");

  const tt = (key, fallback) => {
    try {
      const v = t(key);
      return typeof v === "string" ? v : fallback;
    } catch {
      return fallback;
    }
  };

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const d = await getContactPageData(locale);
        if (!alive) return;
        setData(d || null);
      } catch (e) {
        if (!alive) return;
        setData(null);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [locale]);

  const hero = data?.hero ?? {};
  const info_items = Array.isArray(data?.info_items) ? data.info_items : [];
  const map = data?.map ?? null;
  const working_hours = Array.isArray(data?.working_hours) ? data.working_hours : [];

  const workingData = useMemo(() => {
    const names = dayNames[locale] || dayNames.fa;

    return working_hours.map((d) => {
      const dayIndex = typeof d?.day_index === "number" ? d.day_index : null;
      const day = dayIndex !== null && names[dayIndex] ? names[dayIndex] : "-";

      const isActive = !!d?.is_active;

      if (!isActive) {
        const closedTxt =
          locale === "fa" ? "تعطیل" : locale === "ar" ? "مغلق" : "Closed";
        return { day, time: closedTxt, closed: true };
      }

      const from = safeStr(d?.from_time).slice(0, 5);
      const to = safeStr(d?.to_time).slice(0, 5);
      const time = from && to ? `${from} - ${to}` : "-";

      return { day, time, closed: false };
    });
  }, [working_hours, locale]);

  const embedCode = useMemo(() => {
    if (!map) return "";

    // اگر provider نِشان بود و lat/lng داشتیم، URL بساز
    if (
      map?.provider === "neshan" &&
      (typeof map?.lat === "number" || typeof map?.lat === "string") &&
      (typeof map?.lng === "number" || typeof map?.lng === "string")
    ) {
      const lat = map.lat;
      const lng = map.lng;
      const zoom = map?.zoom || 15;
      return `https://map.neshan.org/?marker=${lat},${lng}&zoom=${zoom}&type=neshan`;
    }

    // در غیر این صورت از embed_code یا embed_url استفاده کن
    return safeStr(map?.embed_code || map?.embed_url);
  }, [map]);

  const hasEmbed = useMemo(() => safeStr(embedCode).trim().length > 0, [embedCode]);

  async function handleSubmit(e) {
    e.preventDefault();

    const full_name = safeStr(form.full_name).trim();
    const email = safeStr(form.email).trim();
    const message = safeStr(form.message).trim();

    if (!full_name || !email || !message) {
      toast.error(tt("toast.incomplete", "Please fill all required fields."));
      return;
    }

    try {
      const res = await sendContactMessage({ full_name, email, message });
      if (res?.error) {
        toast.error(tt("toast.error", "Something went wrong."));
        return;
      }
      toast.success(tt("toast.success", "Message sent successfully."));
      setForm({ full_name: "", email: "", message: "" });
    } catch {
      toast.error(tt("toast.error", "Something went wrong."));
    }
  }

  if (loading) {
    return (
      <>
        <Header logoAnimation={false} iconColor="#000000" stickOnScrollOnly />
        <main className="flex items-center justify-center min-h-screen">
          <span className="animate-pulse text-gray-500">Loading...</span>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header logoAnimation={false} iconColor="#000000" stickOnScrollOnly />
      <ContactStructuredData data={data || {}} />
      <Toaster richColors position="top-center" />

      <main className="bg-white text-black font-sans min-h-screen">
        <HeroBanner
          imageSrc={safeStr(hero?.background || hero?.image || "")}
          title={safeStr(hero?.title || "")}
          description={safeStr(hero?.subtitle || "")}
          fallbackColor="#FFFFFF"
        />

        {/* INFO CARDS */}
        <section className="py-20 px-6 max-w-7xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-12"
          >
            {tt("contactPlane.title", "Contact")}
          </motion.h2>

          {info_items.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-10">
              {info_items.map((item, i) => {
                const type = safeStr(item?.item_type);
                const value = safeStr(item?.value);

                return (
                  <motion.div
                    key={`${type}-${i}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    viewport={{ once: true }}
                    className="border border-gray-200 p-8 rounded-xl"
                  >
                    {infoIcon[type] ?? <MapPin className="w-8 h-8 mx-auto text-black" />}
                    <h3 className="font-bold text-lg mt-4">
                      {tt(`contactPlane.${type}`, type || "info")}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 break-words">
                      {value || "-"}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-600">{tt("empty.info", "No contact info available.")}</p>
          )}
        </section>

        {/* MAP (SAFE) */}
        {hasEmbed ? (
          <section className="my-10 px-4 md:px-10 flex flex-col justify-center items-center">
            <h2 className="text-2xl font-semibold mb-4">{tt("OurLocation", "Map")}</h2>
            <MapEmbed embedCode={embedCode} />
          </section>
        ) : null}

        {/* FORM */}
        <section className="py-24 px-6 bg-black text-white">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl font-extrabold mb-10"
            >
              {tt("form.title", "Send a message")}
            </motion.h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 text-left">
              <div>
                <label className="block text-sm mb-1">
                  {tt("form.fullNameLbl", "Full name")}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-white text-black border border-white/20 focus:outline-none"
                  placeholder={tt("form.fullNamePH", "Your name")}
                  value={form.full_name}
                  onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm mb-1">{tt("form.emailLbl", "Email")}</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-xl bg-white text-black border border-white/20 focus:outline-none"
                  placeholder="example@email.com"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm mb-1">
                  {tt("form.messageLbl", "Message")}
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-white text-black border border-white/20 focus:outline-none"
                  placeholder={tt("form.messagePH", "Write your message...")}
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                />
              </div>

              <div className="text-center mt-6">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-xl hover:bg-gray-200 transition"
                >
                  {tt("form.txtButton", "Send")}
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* WORKING HOURS */}
        {workingData.length > 0 ? (
          <section className="py-20 px-6 max-w-5xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center text-3xl font-bold mb-12"
            >
              {tt("OurWorkingHours", "Working hours")}
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {workingData.map((x, i) => (
                <motion.div
                  key={`${x.day}-${i}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={`rounded-xl p-6 shadow-sm text-center border ${
                    x.closed ? "bg-gray-100 text-gray-600" : "bg-white text-black"
                  }`}
                >
                  <Clock className="w-6 h-6 mx-auto mb-3" />
                  <h4 className="font-bold text-lg">{x.day}</h4>
                  <p className="text-sm mt-1">{x.time}</p>
                </motion.div>
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <Footer />
    </>
  );
}

