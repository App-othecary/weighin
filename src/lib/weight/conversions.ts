import type { WeightUnit } from "@/types/weight";

/**
 * Converts kilograms to the selected display unit.
 */
export function fromKilograms(weightKg: number, unit: WeightUnit): number {
  if (unit === "lb") {
    return weightKg * 2.20462262;
  }

  return weightKg;
}

/**
 * Converts a user-entered weight into kilograms.
 * Kilograms remain the database storage standard.
 */
export function toKilograms(weight: number, unit: WeightUnit): number {
  if (unit === "lb") {
    return weight / 2.20462262;
  }

  return weight;
}

/**
 * Formats a weight for display.
 */
export function formatWeight(weightKg: number, unit: WeightUnit): string {
  return `${fromKilograms(weightKg, unit).toFixed(1)} ${unit}`;
}
