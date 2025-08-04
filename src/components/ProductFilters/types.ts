'use client';

export type FilterType = 'single' | 'multi';

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterItem {
  id: string;
  title: string;
  type: FilterType;
  options: FilterOption[];
  selected: string | string[]; // string برای single و string[] برای multi
}


