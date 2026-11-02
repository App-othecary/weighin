export type WeightEntry = {
  id: string;
  weight: number;
  recordedAt: string;
};

export type WeightGoal = {
  startingWeight: number;
  targetWeight: number;
};

export type WeightUnit = "kg" | "lb";

export type WeightSettings = {
  startingWeight: number;
  targetWeight: number;
  preferredUnit: WeightUnit;
};
