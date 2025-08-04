
import { useMemo } from "react";
import jalaali from "jalaali-js";

const pad = (n: number): string => (n < 10 ? `0${n}` : `${n}`);

export const useJalaliDate = (gregorianDate: string | null | undefined) => {
  const jalali = useMemo(() => {
    if (!gregorianDate) return null;

    try {
      const [gy, gm, gd] = gregorianDate.split("-").map(Number);
      const { jy, jm, jd } = jalaali.toJalaali(gy, gm, gd);
      return `${jy}/${pad(jm)}/${pad(jd)}`;
    } catch (err) {
      console.error("❌ خطا در تبدیل تاریخ:", err);
      return null;
    }
  }, [gregorianDate]);

  return jalali;
};
