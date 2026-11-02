"use client";

import { useState, useActionState } from "react";
import { saveWeightSettings } from "@/app/dashboard/actions";
import type { WeightUnit } from "@/types/weight";
import { fromKilograms, toKilograms } from "@/lib/weight/conversions";

type WeightGoalFormProps = {
  startingWeight: number | null;
  targetWeight: number | null;
  unit: WeightUnit;
};

export default function WeightGoalForm({
  startingWeight,
  targetWeight,
  unit,
}: WeightGoalFormProps) {
  const [state, formAction, isPending] = useActionState(saveWeightSettings, {});

  const [selectedUnit, setSelectedUnit] = useState(unit);

  const [startingValue, setStartingValue] = useState(
    startingWeight === null
      ? ""
      : fromKilograms(startingWeight, unit).toFixed(1),
  );

  const [targetValue, setTargetValue] = useState(
    targetWeight === null ? "" : fromKilograms(targetWeight, unit).toFixed(1),
  );

  /**
   * Converts both visible values when the unit changes.
   */
  function handleUnitChange(nextUnit: WeightUnit) {
    const startingKg =
      startingValue === ""
        ? null
        : toKilograms(Number(startingValue), selectedUnit);

    const targetKg =
      targetValue === ""
        ? null
        : toKilograms(Number(targetValue), selectedUnit);

    setStartingValue(
      startingKg === null ? "" : fromKilograms(startingKg, nextUnit).toFixed(1),
    );

    setTargetValue(
      targetKg === null ? "" : fromKilograms(targetKg, nextUnit).toFixed(1),
    );

    setSelectedUnit(nextUnit);
  }

  return (
    <section className="rounded-xl border border-[#e3e9e1] bg-white p-5">
      <h2 className="text-base font-semibold text-[#202820]">
        Weight settings
      </h2>

      <p className="mt-1 text-sm text-[#687268]">
        Set your starting weight, target and preferred unit.
      </p>

      <form action={formAction} className="mt-5 space-y-4">
        <div>
          <label
            htmlFor="preferredUnit"
            className="mb-2 block text-sm font-medium text-[#303a30]"
          >
            Measurement unit
          </label>

          <select
            id="preferredUnit"
            name="preferredUnit"
            value={selectedUnit}
            onChange={(event) =>
              handleUnitChange(event.target.value as WeightUnit)
            }
            className="w-full rounded-md border border-[#d6ded4] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#657d62]"
          >
            <option value="kg">Kilograms (kg)</option>
            <option value="lb">Pounds (lb)</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="startingWeight"
            className="mb-2 block text-sm font-medium text-[#303a30]"
          >
            Starting weight
          </label>

          <input
            id="startingWeight"
            name="startingWeight"
            type="number"
            min="0.1"
            max={selectedUnit === "kg" ? "500" : "1102.3"}
            step="0.1"
            value={startingValue}
            onChange={(event) => setStartingValue(event.target.value)}
            required
            placeholder={`Weight in ${selectedUnit}`}
            className="w-full rounded-md border border-[#d6ded4] px-3 py-2.5 text-sm outline-none focus:border-[#657d62]"
          />
        </div>

        <div>
          <label
            htmlFor="targetWeight"
            className="mb-2 block text-sm font-medium text-[#303a30]"
          >
            Target weight
          </label>

          <input
            id="targetWeight"
            name="targetWeight"
            type="number"
            min="0.1"
            max={selectedUnit === "kg" ? "500" : "1102.3"}
            step="0.1"
            value={targetValue}
            onChange={(event) => setTargetValue(event.target.value)}
            required
            placeholder={`Weight in ${selectedUnit}`}
            className="w-full rounded-md border border-[#d6ded4] px-3 py-2.5 text-sm outline-none focus:border-[#657d62]"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-[#344a36] px-4 py-3 text-sm font-medium text-white hover:bg-[#263a29] disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save settings"}
        </button>
      </form>

      {state.error && (
        <p role="alert" className="mt-4 text-sm text-red-700">
          {state.error}
        </p>
      )}

      {state.success && (
        <p role="status" className="mt-4 text-sm text-[#344a36]">
          {state.success}
        </p>
      )}
    </section>
  );
}
