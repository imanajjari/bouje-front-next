'use client';

import { useState } from 'react';

interface Option {
  label: string;
  value: string;
}

interface MultiSelectDropdownProps {
  title: string;
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  open: boolean;
  onToggle: () => void;
}

export default function MultiSelectDropdown({
  title,
  options,
  selected,
  onChange,
  open,
  onToggle,
}: MultiSelectDropdownProps) {
  const [tempSelected, setTempSelected] = useState<string[]>(selected);

  const toggleOption = (value: string) => {
    setTempSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const apply = () => {
    onChange(tempSelected);
    onToggle(); // منو رو ببند بعد از تایید
  };

  const reset = () => {
    setTempSelected([]);
  };

  return (
    <div className="relative text-right">
      <button
        onClick={onToggle}
        className="text-sm font-medium py-2 px-4 border-b border-gray-500  w-full flex justify-between items-center hover:border-gray-800"
      >
        {title}
        <span className="text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div
          className="absolute z-10 mt-2 bg-white shadow-lg rounded border border-gray-200 max-h-96 overflow-auto"
          style={{
            minWidth: '300px',
            maxWidth: '90vw',
            insetInlineEnd: 0,
          }}
        >
          <div className="p-3 space-y-2">
            {options.map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tempSelected.includes(option.value)}
                  onChange={() => toggleOption(option.value)}
                  className="accent-black"
                />
                <span className="text-sm text-gray-800">{option.label}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-between border-t border-gray-200 px-4 py-2">
            <button onClick={reset} className="text-sm text-gray-500 hover:text-black">پاک‌سازی</button>
            <button onClick={apply} className="text-sm font-semibold text-black hover:underline">تأیید</button>
          </div>
        </div>
      )}
    </div>
  );
}
