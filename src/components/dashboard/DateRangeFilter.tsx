"use client";

import { DATE_RANGE_OPTIONS, type DateRange } from "@/lib/weight/date-filters";

type DateRangeFilterProps = {
  value: DateRange;
  onChange: (value: DateRange) => void;
};

export default function DateRangeFilter({
  value,
  onChange,
}: DateRangeFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {DATE_RANGE_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={`rounded-md border px-3 py-2 text-sm transition-colors ${
            value === option.value
              ? "border-emerald-700 bg-emerald-700 text-white"
              : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
