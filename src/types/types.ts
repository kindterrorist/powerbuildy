// src/types.ts - UPDATED WITH FIXES
export type Exercise = {
  id: string;
  name: string;
  category: string;
  tutorial?: string;
  thumb?: string; // data URL or external URL
  defaultSets?: number;
  defaultReps?: string;
  defaultRest?: number;
  createdAt?: number;
  isPublic?: boolean;
};

// FIXED: Added thumb and tutorial to ProgramExercise
export type ProgramExercise = {
  id: string;
  exerciseId?: string | null;
  name: string;
  sets: number;
  reps: string;
  rest: number;
  order: number;
  supersetGroup?: number | null;
  thumb?: string; // ADD THIS - needed for export
  tutorial?: string; // ADD THIS - needed for export
};

export type ProgramDay = {
  id: string;
  title: string;
  index: number;
  exercises: ProgramExercise[];
};

export type Program = {
  id: string;
  title: string;
  subtitle?: string;
  days: ProgramDay[];
  createdAt?: number;
};

export type TrainerSettings = {
  accent: string;
  logo?: string; // data URL
};
