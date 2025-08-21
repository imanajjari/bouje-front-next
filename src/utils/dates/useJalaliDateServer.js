// utils/dates/useJalaliDateServer.js
// ⚠️ مخصوص Server Component ها — چون از Intl و تقویم جلالی استفاده می‌کنه
import "server-only";

/**
 * تاریخ رو به جلالی تبدیل می‌کنه (SSR-safe)
 * @param {Date|string|number|null|undefined} input
 * @param {Object} opts
 * @param {boolean} opts.withTime - نمایش ساعت هم داشته باشه یا نه
 * @param {"full"|"long"|"medium"|"short"} opts.dateStyle
 * @param {"short"|"medium"|"long"} opts.timeStyle
 * @param {string} opts.timeZone - پیش‌فرض Asia/Tehran
 * @param {"fa"|"en"} opts.digits - خروجی با عدد فارسی یا لاتین
 * @param {string} opts.fallback - متن جایگزین اگه تاریخ معتبر نبود
 * @returns {string}
 */
export function useJalaliDateServer(input, opts = {}) {
  const {
    withTime = false,
    dateStyle = "long",
    timeStyle = "short",
    timeZone = "Asia/Tehran",
    digits = "fa",
    fallback = "",
  } = opts;

  if (input == null) return fallback;

  const d = input instanceof Date ? input : new Date(input);
  if (isNaN(d.getTime())) return fallback;

  // locale: جلالی + اعداد فارسی یا لاتین
  const locale =
    digits === "fa"
      ? "fa-IR-u-ca-persian"
      : "fa-IR-u-ca-persian-nu-latn";

  const formatOptions = withTime
    ? { dateStyle, timeStyle, timeZone }
    : { dateStyle, timeZone };

  return new Intl.DateTimeFormat(locale, formatOptions).format(d);
}

/**
 * نسخه ساده برای YYYY/MM/DD
 * @param {Date|string|number|null|undefined} input
 * @param {Object} opts
 * @param {string} opts.timeZone
 * @param {"fa"|"en"} opts.digits
 * @param {string} opts.fallback
 * @returns {string}
 */
export function useJalaliDateServerYMD(input, opts = {}) {
  const { timeZone = "Asia/Tehran", digits = "fa", fallback = "" } = opts;

  if (input == null) return fallback;

  const d = input instanceof Date ? input : new Date(input);
  if (isNaN(d.getTime())) return fallback;

  const locale =
    digits === "fa"
      ? "fa-IR-u-ca-persian"
      : "fa-IR-u-ca-persian-nu-latn";

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone,
  }).format(d);
}
