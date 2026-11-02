"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { WeightEntry, WeightUnit } from "@/types/weight";
import { fromKilograms } from "@/lib/weight/conversions";

type WeightChartProps = {
  entries: WeightEntry[];
  targetWeight?: number;
  unit: WeightUnit;
};

/**
 * Formats a stored date for the graph.
 */
function formatChartDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

/**
 * Displays weight measurements in the user's preferred unit.
 */
export default function WeightChart({
  entries,
  targetWeight,
  unit,
}: WeightChartProps) {
  const chartData = entries.map((entry) => ({
    dateLabel: formatChartDate(entry.recordedAt),
    weight: fromKilograms(entry.weight, unit),
  }));

  if (entries.length === 0) {
    return (
      <section className="rounded-xl border border-[#e3e9e1] bg-white p-5">
        <h2 className="text-base font-semibold text-[#202820]">Weight trend</h2>
        <p className="mt-4 text-sm text-[#687268]">
          Your graph will appear after your first measurement.
        </p>
      </section>
    );
  }

  const targetDisplay =
    targetWeight === undefined ? undefined : fromKilograms(targetWeight, unit);

  return (
    <section className="rounded-xl border border-[#e3e9e1] bg-white p-5">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-[#202820]">Weight trend</h2>
        <p className="mt-1 text-sm text-[#687268]">Measurements in {unit}</p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 12, left: 0, bottom: 5 }}
          >
            <CartesianGrid stroke="#e9eee7" strokeDasharray="3 3" />

            <XAxis
              dataKey="dateLabel"
              tick={{ fill: "#687268", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              domain={["auto", "auto"]}
              tick={{ fill: "#687268", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={48}
            />

            <Tooltip
              formatter={(value) => [
                `${Number(value).toFixed(1)} ${unit}`,
                "Weight",
              ]}
            />

            {targetDisplay !== undefined && (
              <ReferenceLine
                y={targetDisplay}
                stroke="#879b82"
                strokeDasharray="5 5"
                label={{
                  value: "Target",
                  fill: "#687268",
                  fontSize: 11,
                }}
              />
            )}

            <Line
              type="monotone"
              dataKey="weight"
              stroke="#344a36"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#344a36" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
