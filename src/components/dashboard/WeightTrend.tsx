import type { WeightUnit } from "@/types/weight";
import { fromKilograms } from "@/lib/weight/conversions";

type WeightTrendProps = {
  trend: number | null;
  unit: WeightUnit;
};

export default function WeightTrend({ trend, unit }: WeightTrendProps) {
  if (trend === null) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-500">Weight trend</p>
        <p className="mt-2 text-lg font-semibold text-gray-800">
          Not enough data
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Add at least two measurements to see your trend.
        </p>
      </div>
    );
  }

  const displayedTrend = fromKilograms(Math.abs(trend), unit);
  const direction =
    trend < 0 ? "decreased" : trend > 0 ? "increased" : "unchanged";

  //   const formattedTrend = `${displayedTrend.toFixed(1)} ${unit}`;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-sm text-gray-500">Weight trend</p>

      <p className="mt-2 text-2xl font-semibold text-gray-900">
        {trend === 0 ? "0.0" : trend < 0 ? "−" : "+"}
        {displayedTrend.toFixed(1)} {unit}
      </p>

      <p className="mt-1 text-sm text-gray-500">
        Weight {direction} over the selected period.
      </p>
    </div>
  );
}
