'use client';

import React, { useState } from "react";

interface DropdownProps {
  label: string; // عنوان/لیبل که جدا ارسال می‌شود
  options: string[]; // گزینه‌ها
  value: string; // مقدار انتخاب شده
  onChange: (value: string) => void; // تغییر مقدار انتخابی
  inputClass?: string; // برای کاستومایز ظاهر input
  containerClass?: string; // برای کاستومایز ظاهر کل کامپوننت
}

export default function CustomDropdown({
  label,
  options,
  value,
  onChange,
  inputClass = "border border-gray-200 bg-gray-100 rounded-md px-4 py-3 text-sm text-right cursor-pointer",
  containerClass = "space-y-2 max-w-md mx-auto"
}: DropdownProps) {
  return (
    <div dir="rtl" className={containerClass}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full ${inputClass}`}
      >
        <option value="" disabled>
          انتخاب کنید
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
