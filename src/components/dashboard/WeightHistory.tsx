"use client";

import { useState, useActionState } from "react";
import { updateWeightEntry, deleteWeightEntry } from "@/app/dashboard/actions";
import type { WeightEntry, WeightUnit } from "@/types/weight";
import { fromKilograms } from "@/lib/weight/conversions";

type WeightHistoryProps = {
  entries: WeightEntry[];
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

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Displays and manages an individual measurement.
 */
function WeightHistoryRow({
  entry,
  unit,
}: {
  entry: WeightEntry;
  unit: WeightUnit;
}) {
  const [isEditing, setIsEditing] = useState(false);

  const [updateState, updateAction, isUpdating] = useActionState(
    updateWeightEntry,
    {},
  );

  const [deleteState, deleteAction, isDeleting] = useActionState(
    deleteWeightEntry,
    {},
  );

  return (
    <tr className="border-t border-[#e9eee7]">
      <td className="px-4 py-3 text-sm text-[#465046]">
        {formatDate(entry.recordedAt)}
      </td>

      <td className="px-4 py-3 text-sm font-medium text-[#202820]">
        {isEditing ? (
          <form
            id={`edit-${entry.id}`}
            action={updateAction}
            className="flex flex-wrap items-center gap-2"
          >
            <input type="hidden" name="id" value={entry.id} />
            <input type="hidden" name="unit" value={unit} />

            <input
              type="number"
              name="weight"
              min="0.1"
              max={unit === "kg" ? "500" : "1102.3"}
              step="0.1"
              defaultValue={fromKilograms(entry.weight, unit).toFixed(1)}
              required
              aria-label={`Weight in ${unit}`}
              className="w-24 rounded border border-[#d6ded4] px-2 py-1 text-sm"
            />

            <input
              type="date"
              name="recordedAt"
              defaultValue={entry.recordedAt}
              max={getTodayDate()}
              required
              aria-label="Measurement date"
              className="rounded border border-[#d6ded4] px-2 py-1 text-sm"
            />
          </form>
        ) : (
          `${fromKilograms(entry.weight, unit).toFixed(1)} ${unit}`
        )}
      </td>

      <td className="px-4 py-3">
        {isEditing ? (
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              form={`edit-${entry.id}`}
              disabled={isUpdating}
              className="text-sm font-medium text-[#344a36] underline underline-offset-4 disabled:opacity-50"
            >
              {isUpdating ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-sm text-[#687268] underline underline-offset-4"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-sm font-medium text-[#344a36] underline underline-offset-4"
            >
              Edit
            </button>

            <form action={deleteAction}>
              <input type="hidden" name="id" value={entry.id} />

              <button
                type="submit"
                disabled={isDeleting}
                className="text-sm text-red-700 underline underline-offset-4 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </form>
          </div>
        )}
      </td>

      <td className="px-4 py-3">
        {updateState.error && (
          <p role="alert" className="text-xs text-red-700">
            {updateState.error}
          </p>
        )}

        {deleteState.error && (
          <p role="alert" className="text-xs text-red-700">
            {deleteState.error}
          </p>
        )}

        {(updateState.success || deleteState.success) && (
          <p role="status" className="text-xs text-[#344a36]">
            {updateState.success || deleteState.success}
          </p>
        )}
      </td>
    </tr>
  );
}

/**
 * Displays the user's measurement history.
 */
export default function WeightHistory({ entries, unit }: WeightHistoryProps) {
  const sortedEntries = [...entries].sort((a, b) =>
    b.recordedAt.localeCompare(a.recordedAt),
  );

  return (
    <section className="overflow-hidden rounded-xl border border-[#e3e9e1] bg-white">
      <div className="p-5">
        <h2 className="text-base font-semibold text-[#202820]">
          Weight history
        </h2>
      </div>

      {sortedEntries.length === 0 ? (
        <p className="px-5 pb-5 text-sm text-[#687268]">
          No measurements recorded yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead className="bg-[#f7f9f6]">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#687268]">
                  Date
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#687268]">
                  Weight
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#687268]">
                  Actions
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#687268]">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedEntries.map((entry) => (
                <WeightHistoryRow key={entry.id} entry={entry} unit={unit} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
