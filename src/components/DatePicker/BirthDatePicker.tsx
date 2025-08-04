// components/DatePicker/BirthDatePicker.tsx
'use client';

import React from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import highlightWeekends from "react-multi-date-picker/plugins/highlight_weekends";
import jalaali from "jalaali-js";

interface BirthDatePickerProps {
  value: string;
  onChangeJalaliGregorian: (data: { jalali: string; gregorian: string }) => void;
}

const BirthDatePicker = ({ value, onChangeJalaliGregorian }: BirthDatePickerProps) => {
  const fixPersianNumbers = (str: string): string => {
    return str.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
  };

  const handleChange = (jalaliValue: any) => {
    const jalaliDateString = fixPersianNumbers(jalaliValue.format('YYYY/MM/DD'));
    const [jy, jm, jd] = jalaliDateString.split('/').map(Number);
    const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
    const gregorianDate = `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`;

    onChangeJalaliGregorian({
      jalali: jalaliDateString,
      gregorian: gregorianDate,
    });
  };

  return (
    <div dir="rtl" className="w-full mx-auto space-y-2">
      <DatePicker
        value={value}
        onChange={handleChange}
        format="YYYY/MM/DD"
        calendar={persian}
        locale={persian_fa}
        plugins={[highlightWeekends()]}
        placeholder="یک تاریخ انتخاب کنید"
        calendarPosition="bottom-right"
        inputClass="w-full border border-gray-200 bg-gray-100 rounded-none px-4 py-3 text-sm text-right cursor-pointer outline-1 outline-gray-200 focus-within:outline-black"
        containerClassName="w-full"
      />
    </div>
  );
};

export default BirthDatePicker;
