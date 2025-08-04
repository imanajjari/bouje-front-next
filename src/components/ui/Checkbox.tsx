'use client';

import { useState } from "react";

interface CheckboxProps {
  id: string;
  checked: boolean;  // تغییرات اینجا
  onCheckedChange: (checked: boolean) => void;
}

export function Checkbox({ id, checked, onCheckedChange }: CheckboxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    onCheckedChange(newChecked); // ارسال تغییرات به والد
  };

  return (
    <div className="flex items-center space-x-3">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleChange}
        className="w-6 h-6 border-2 outline-black accent-black rounded-full bg-white transition-all duration-300 ease-in-out cursor-pointer"
      />
    </div>
  );
}
