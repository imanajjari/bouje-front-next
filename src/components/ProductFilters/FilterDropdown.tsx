'use client';

import { FilterItem } from './types';

interface FilterDropdownProps {
  filter: FilterItem;
  onChange: (value: string, id: string) => void;
  open: boolean;
  onToggle: () => void;
}

export default function FilterDropdown({ filter, onChange, open, onToggle }: FilterDropdownProps) {
  return (
    <div className="relative text-right">
      <button
        onClick={onToggle}
        className="text-sm font-medium py-2 px-3 border-b border-gray-500 flex items-center gap-1 hover:border-gray-800"
      >
        {filter.title}
        <span className="text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 bg-white shadow-lg rounded w-48 z-10">
          {filter.options.map((option) => (
            <button
              key={option.value}
              className={`w-full text-right px-4 py-2 text-sm hover:bg-gray-100 ${
                option.value === filter.selected ? 'bg-gray-200 font-semibold' : ''
              }`}
              onClick={() => {
                onChange(option.value, filter.id);
                onToggle(); // بعد از انتخاب، منو رو ببند
              }}
            >
              {option.label}
              {option.count !== undefined && (
                <span className="text-xs text-gray-500 ml-2">({option.count})</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
