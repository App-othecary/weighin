"use client";

import { useMemo, useState } from "react";

import type { WeightEntry, WeightUnit } from "@/types/weight";

import {
  calculateTrend,
  filterEntriesByDate,
  type DateRange,
} from "@/lib/weight/date-filters";

import DateRangeFilter from "@/components/dashboard/DateRangeFilter";
import WeightTrend from "@/components/dashboard/WeightTrend";
import WeightChart from "@/components/dashboard/WeightChart";
import WeightHistory from "@/components/dashboard/WeightHistory";

type FilteredWeightDashboardProps = {
  entries: WeightEntry[];
  unit: WeightUnit;
  targetWeight: number | null;
};

export default function FilteredWeightDashboard({
  entries,
  unit,
  targetWeight,
}: FilteredWeightDashboardProps) {
  const [range, setRange] = useState<DateRange>("all");

  const filteredEntries = useMemo(
    () => filterEntriesByDate(entries, range, new Date()),
    [entries, range],
  );

  const trend = useMemo(
    () => calculateTrend(filteredEntries),
    [filteredEntries],
  );

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Weight history
          </h2>
          <p className="text-sm text-gray-500">
            Filter your measurements by date.
          </p>
        </div>

        <DateRangeFilter value={range} onChange={setRange} />
      </div>

      <WeightTrend trend={trend} unit={unit} />

      <WeightChart
        entries={filteredEntries}
        targetWeight={targetWeight ?? undefined}
        unit={unit}
      />

      <WeightHistory entries={filteredEntries} unit={unit} />
    </section>
  );
}
