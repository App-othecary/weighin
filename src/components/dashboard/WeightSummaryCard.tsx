type WeightSummaryCardProps = {
  label: string;
  value: number | null;
  unit: string;
  description?: string;
};

export default function WeightSummaryCard({
  label,
  value,
  unit,
  description,
}: WeightSummaryCardProps) {
  return (
    <section className="rounded-xl border border-[#e3e9e1] bg-white p-5">
      <p className="text-sm font-medium text-[#687268]">{label}</p>

      <p className="mt-3 text-2xl font-semibold tracking-tight text-[#202820]">
        {value === null ? "—" : `${value.toFixed(1)} ${unit}`}
      </p>

      {description && (
        <p className="mt-2 text-sm text-[#687268]">{description}</p>
      )}
    </section>
  );
}
