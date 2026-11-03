import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import FilteredWeightDashboard from "@/components/dashboard/FilteredWeightDashboard";
import AppNavigation from "@/components/dashboard/AppNavigation";
import WeightSummaryCard from "@/components/dashboard/WeightSummaryCard";
import WeightEntryForm from "@/components/dashboard/WeightEntryForm";
import WeightGoalForm from "@/components/dashboard/WeightGoalForm";
import SignOutButton from "@/components/auth/SignOutButton";

import type { WeightEntry, WeightUnit } from "@/types/weight";
import { fromKilograms, formatWeight } from "@/lib/weight/conversions";

/**
 * Authenticated dashboard.
 * User-specific Supabase data is loaded at request time.
 */
export default async function DashboardContent() {
  const supabase = await createClient();

  const { data: claims, error: authError } = await supabase.auth.getClaims();

  if (authError || !claims?.claims) {
    redirect("/login");
  }

  const [
    { data: databaseEntries, error: entriesError },
    { data: goal },
    { data: profile },
  ] = await Promise.all([
    supabase
      .from("weight_entries")
      .select("id, weight_kg, recorded_at")
      .order("recorded_at", { ascending: true }),

    supabase
      .from("weight_goals")
      .select("starting_weight_kg, target_weight_kg")
      .maybeSingle(),

    supabase.from("profiles").select("preferred_unit").maybeSingle(),
  ]);

  if (entriesError) {
    console.error("Loading measurements failed:", entriesError.message);
  }

  const entries: WeightEntry[] = (databaseEntries ?? []).map((entry) => ({
    id: entry.id,
    weight: Number(entry.weight_kg),
    recordedAt: entry.recorded_at,
  }));

  const unit: WeightUnit = profile?.preferred_unit === "lb" ? "lb" : "kg";

  const latestEntry = entries[entries.length - 1];

  const startingWeight = goal ? Number(goal.starting_weight_kg) : null;

  const targetWeight = goal ? Number(goal.target_weight_kg) : null;

  const currentWeight = latestEntry?.weight ?? null;

  const totalChange =
    startingWeight !== null && currentWeight !== null
      ? currentWeight - startingWeight
      : null;

  const remainingWeight =
    targetWeight !== null && currentWeight !== null
      ? currentWeight - targetWeight
      : null;

  return (
    <div className="flex min-h-screen bg-[#f7f9f6]">
      <AppNavigation />

      <main className="min-w-0 flex-1 px-5 py-7 md:px-8">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#202820]">
                Dashboard
              </h1>

              <p className="mt-1 text-sm text-[#687268]">
                Your recorded weight measurements.
              </p>
            </div>

            <SignOutButton />
          </header>

          {entriesError && (
            <p role="alert" className="mb-5 text-sm text-red-700">
              We couldn't load your measurements.
            </p>
          )}

          <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <WeightSummaryCard
              label="Current weight"
              value={
                currentWeight === null
                  ? null
                  : fromKilograms(currentWeight, unit)
              }
              unit={unit}
              description={
                latestEntry
                  ? `Last recorded ${latestEntry.recordedAt}`
                  : "No measurements yet"
              }
            />

            <WeightSummaryCard
              label="Target weight"
              value={
                targetWeight === null ? null : fromKilograms(targetWeight, unit)
              }
              unit={unit}
              description={
                targetWeight === null
                  ? "Set your target below"
                  : "Your saved target"
              }
            />

            <WeightSummaryCard
              label="Change since starting"
              value={
                totalChange === null
                  ? null
                  : fromKilograms(Math.abs(totalChange), unit) *
                    Math.sign(totalChange)
              }
              unit={unit}
              description={
                totalChange === null
                  ? "Set your starting weight"
                  : totalChange < 0
                    ? "Decrease"
                    : totalChange > 0
                      ? "Increase"
                      : "No change"
              }
            />
          </section>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            <div className="min-w-0 space-y-6">
              <FilteredWeightDashboard
                entries={entries}
                unit={unit}
                targetWeight={targetWeight}
              />
            </div>

            <div className="space-y-6">
              <WeightEntryForm unit={unit} />

              <WeightGoalForm
                startingWeight={startingWeight}
                targetWeight={targetWeight}
                unit={unit}
              />

              <section className="rounded-xl border border-[#e3e9e1] bg-white p-5">
                <h2 className="text-base font-semibold text-[#202820]">
                  Remaining to target
                </h2>

                <p className="mt-3 text-2xl font-semibold text-[#344a36]">
                  {remainingWeight === null
                    ? "—"
                    : formatWeight(Math.max(remainingWeight, 0), unit)}
                </p>

                <p className="mt-1 text-sm text-[#687268]">
                  {remainingWeight === null
                    ? "Set your goal and record a measurement."
                    : remainingWeight <= 0
                      ? "You have reached or passed your target."
                      : "Based on your latest measurement."}
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
