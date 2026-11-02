import type { WeightEntry } from "@/types/weight";

export type DateRange = "7d" | "30d" | "90d" | "all";

export const DATE_RANGE_OPTIONS = [
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "90 days", value: "90d" },
  { label: "All time", value: "all" },
] as const;

export function filterEntriesByDate(
  entries: WeightEntry[],
  range: DateRange,
  referenceDate: Date,
): WeightEntry[] {
  if (range === "all" || entries.length === 0) {
    return entries;
  }

  const days = Number.parseInt(range, 10);
  const cutoff = new Date(referenceDate);

  cutoff.setHours(0, 0, 0, 0);
  cutoff.setDate(cutoff.getDate() - (days - 1));

  return entries.filter((entry) => {
    const recordedDate = new Date(`${entry.recordedAt}T12:00:00`);
    return recordedDate >= cutoff;
  });
}

export function calculateTrend(entries: WeightEntry[]): number | null {
  if (entries.length < 2) {
    return null;
  }

  const sorted = [...entries].sort(
    (a, b) =>
      new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime(),
  );

  return sorted[sorted.length - 1].weight - sorted[0].weight;
}
