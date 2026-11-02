import type { WeightEntry, WeightGoal } from "@/types/weight";

/**
 * Provides temporary weight measurements for interface development.
 *
 * This data will eventually be replaced by database queries.
 */
export const sampleWeightEntries: WeightEntry[] = [
  { id: "1", weight: 74.2, recordedAt: "2026-10-01" },
  { id: "2", weight: 73.8, recordedAt: "2026-10-05" },
  { id: "3", weight: 74.0, recordedAt: "2026-10-10" },
  { id: "4", weight: 73.1, recordedAt: "2026-10-15" },
  { id: "5", weight: 72.8, recordedAt: "2026-10-20" },
  { id: "6", weight: 72.4, recordedAt: "2026-10-25" },
];

/**
 * Provides a temporary target weight and starting weight.
 */
export const sampleWeightGoal: WeightGoal = {
  startingWeight: 74.2,
  targetWeight: 65.0,
};
