"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { WeightUnit } from "@/types/weight";
import { toKilograms } from "@/lib/weight/conversions";

export type WeightActionState = {
  error?: string;
  success?: string;
};

/**
 * Checks that the submitted weight and date are valid.
 * The database also enforces its own weight constraints.
 */

function validateMeasurement(formData: FormData) {
  const enteredWeight = Number(formData.get("weight"));
  const recordedAt = String(formData.get("recordedAt") ?? "");
  const unitValue = String(formData.get("unit") ?? "kg");

  if (unitValue !== "kg" && unitValue !== "lb") {
    return { error: "Please select kg or lb." };
  }

  if (
    !Number.isFinite(enteredWeight) ||
    enteredWeight <= 0 ||
    enteredWeight > (unitValue === "kg" ? 500 : 1102.3)
  ) {
    return { error: `Enter a valid weight in ${unitValue}.` };
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(recordedAt)) {
    return { error: "Please enter a valid measurement date." };
  }

  const date = new Date(`${recordedAt}T12:00:00`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== recordedAt
  ) {
    return { error: "Please enter a valid measurement date." };
  }

  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  if (recordedAt > todayString) {
    return { error: "A measurement date cannot be in the future." };
  }

  const weightKg = toKilograms(enteredWeight, unitValue);

  return {
    weight: Math.round(weightKg * 100) / 100,
    recordedAt,
  };
}

/**
 * Gets the authenticated Supabase client.
 * Returns null if no valid user session exists.
 */
async function getAuthenticatedClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return null;
  }

  return supabase;
}

/**
 * Adds a new weight measurement.
 */
export async function addWeightEntry(
  _previousState: WeightActionState,
  formData: FormData,
): Promise<WeightActionState> {
  const measurement = validateMeasurement(formData);

  if ("error" in measurement) {
    return { error: measurement.error };
  }

  const supabase = await getAuthenticatedClient();

  if (!supabase) {
    return { error: "Please sign in before adding a measurement." };
  }

  const { error } = await supabase.from("weight_entries").insert({
    weight_kg: measurement.weight,
    recorded_at: measurement.recordedAt,
  });

  if (error) {
    console.error("Add weight entry failed:", error.message);
    return { error: "Could not save your measurement. Please try again." };
  }

  revalidatePath("/dashboard");

  return { success: "Measurement saved." };
}

/**
 * Updates an existing weight measurement.
 */
export async function updateWeightEntry(
  _previousState: WeightActionState,
  formData: FormData,
): Promise<WeightActionState> {
  const id = String(formData.get("id") ?? "");
  const measurement = validateMeasurement(formData);

  if (!id) {
    return { error: "Measurement ID is missing." };
  }

  if ("error" in measurement) {
    return { error: measurement.error };
  }

  const supabase = await getAuthenticatedClient();

  if (!supabase) {
    return { error: "Please sign in before editing a measurement." };
  }

  const { data, error } = await supabase
    .from("weight_entries")
    .update({
      weight_kg: measurement.weight,
      recorded_at: measurement.recordedAt,
    })
    .eq("id", id)
    .select("id");

  if (error) {
    console.error("Update weight entry failed:", error.message);
    return { error: "Could not update your measurement." };
  }

  if (!data?.length) {
    return { error: "Measurement not found or access denied." };
  }

  revalidatePath("/dashboard");

  return { success: "Measurement updated." };
}

/**
 * Deletes an existing weight measurement.
 */
export async function deleteWeightEntry(
  _previousState: WeightActionState,
  formData: FormData,
): Promise<WeightActionState> {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    return { error: "Measurement ID is missing." };
  }

  const supabase = await getAuthenticatedClient();

  if (!supabase) {
    return { error: "Please sign in before deleting a measurement." };
  }

  const { data, error } = await supabase
    .from("weight_entries")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) {
    console.error("Delete weight entry failed:", error.message);
    return { error: "Could not delete your measurement." };
  }

  if (!data?.length) {
    return { error: "Measurement not found or access denied." };
  }

  revalidatePath("/dashboard");

  return { success: "Measurement deleted." };
}

/**
 * Saves the user's starting weight, target weight
 * and preferred display unit.
 */
export async function saveWeightSettings(
  _previousState: WeightActionState,
  formData: FormData,
): Promise<WeightActionState> {
  const startingWeight = Number(formData.get("startingWeight"));
  const targetWeight = Number(formData.get("targetWeight"));
  const unitValue = String(formData.get("preferredUnit") ?? "");

  if (
    !Number.isFinite(startingWeight) ||
    !Number.isFinite(targetWeight) ||
    startingWeight <= 0 ||
    targetWeight <= 0 ||
    startingWeight > 1102.3 ||
    targetWeight > 1102.3
  ) {
    return { error: "Enter valid starting and target weights." };
  }

  if (unitValue !== "kg" && unitValue !== "lb") {
    return { error: "Please select kg or lb." };
  }

  const unit: WeightUnit = unitValue;

  const startingWeightKg = toKilograms(startingWeight, unit);
  const targetWeightKg = toKilograms(targetWeight, unit);

  if (startingWeightKg > 500 || targetWeightKg > 500) {
    return { error: "The entered weight is above the allowed limit." };
  }

  const supabase = await createClient();
  const { data: claims, error: authError } = await supabase.auth.getClaims();

  const userId = claims?.claims?.sub;

  if (authError || typeof userId !== "string") {
    return { error: "Please sign in before saving your settings." };
  }

  // Save the user's display preference.
  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: userId,
      preferred_unit: unit,
    },
    { onConflict: "id" },
  );

  if (profileError) {
    console.error("Saving profile failed:", profileError.message);
    return { error: "Could not save your unit preference." };
  }

  // Save the user's weight goals.
  const { error: goalError } = await supabase.from("weight_goals").upsert(
    {
      user_id: userId,
      starting_weight_kg: startingWeightKg,
      target_weight_kg: targetWeightKg,
    },
    { onConflict: "user_id" },
  );

  if (goalError) {
    console.error("Saving weight goal failed:", goalError.message);
    return { error: "Could not save your weight goals." };
  }

  revalidatePath("/dashboard");

  return { success: "Weight settings saved." };
}
