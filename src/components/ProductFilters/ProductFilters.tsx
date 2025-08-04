'use client';


import MultiSelectDropdown from './MultiSelectFilter'; 
import FilterDropdown from './FilterDropdown';
import { FilterItem } from './types';
import { useState } from 'react';
import { div } from 'framer-motion/client';

interface ProductFiltersProps {
  filters: FilterItem[];
  onFilterChange: (value: string | string[], filterId: string) => void;
}

export default function ProductFilters({ filters, onFilterChange }: ProductFiltersProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  return (
    <div className='flex justify-between p-2'>
    <div className="flex flex-wrap justify-end gap-4 w-full md:w-auto">
      {filters.map((filter) =>
        filter.type === 'single' ? (
          <FilterDropdown
            key={filter.id}
            filter={filter}
            onChange={onFilterChange}
            open={openDropdownId === filter.id}
            onToggle={() =>
              setOpenDropdownId(openDropdownId === filter.id ? null : filter.id)
            }
          />
        ) : (
          <MultiSelectDropdown
            key={filter.id}
            title={filter.title}
            options={filter.options}
            selected={filter.selected as string[]}
            onChange={(value) => onFilterChange(value, filter.id)}
            open={openDropdownId === filter.id}
            onToggle={() =>
              setOpenDropdownId(openDropdownId === filter.id ? null : filter.id)
            }
          />
        )
      )}
    </div>
    </div>
  );
}
