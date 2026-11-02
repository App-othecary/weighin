"use client";

import { useActionState } from "react";
import { addWeightEntry } from "@/app/dashboard/actions";
import type { WeightUnit } from "@/types/weight";

type WeightEntryFormProps = {
  unit: WeightUnit;
};

function getTodayDate() {
  const today = new Date();

  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
}

/**
 * Adds a measurement using the selected display unit.
 */
export default function WeightEntryForm({ unit }: WeightEntryFormProps) {
  const [state, formAction, isPending] = useActionState(addWeightEntry, {});

  return (
    <section className="rounded-xl border border-[#e3e9e1] bg-white p-5">
      <h2 className="text-base font-semibold text-[#202820]">
        Add measurement
      </h2>

      <form action={formAction} className="mt-5 space-y-4">
        <input type="hidden" name="unit" value={unit} />

        <div>
          <label
            htmlFor="weight"
            className="mb-2 block text-sm font-medium text-[#303a30]"
          >
            Weight ({unit})
          </label>

          <input
            id="weight"
            name="weight"
            type="number"
            min="0.1"
            max={unit === "kg" ? "500" : "1102.3"}
            step="0.1"
            required
            placeholder={unit === "kg" ? "e.g. 72.4" : "e.g. 159.6"}
            className="w-full rounded-md border border-[#d6ded4] px-3 py-2.5 text-sm outline-none focus:border-[#657d62]"
          />
        </div>

        <div>
          <label
            htmlFor="recordedAt"
            className="mb-2 block text-sm font-medium text-[#303a30]"
          >
            Measurement date
          </label>

          <input
            id="recordedAt"
            name="recordedAt"
            type="date"
            max={getTodayDate()}
            defaultValue={getTodayDate()}
            required
            className="w-full rounded-md border border-[#d6ded4] px-3 py-2.5 text-sm outline-none focus:border-[#657d62]"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-[#344a36] px-4 py-3 text-sm font-medium text-white hover:bg-[#263a29] disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save measurement"}
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
