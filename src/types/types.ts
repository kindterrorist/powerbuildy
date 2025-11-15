export interface TraineeInfo {
  name: string;
  age: string;
  weight: string;
  height: string;
}

export interface TrainerInfo {
  name: string;
  email: string;
  contact: string;
  bio: string;
}

export interface Exercise {
  id: number; // Using number for simplicity in this context, could be string
  name: string;
  sets: string;
  reps: string;
  rest: string;
  video?: string;
  // Note: equipment and difficulty are stored in the database, not the instance added to a day
}

export interface Day {
  id: number;
  name: string;
  exercises: Exercise[];
}

export interface ProgramState {
  name: string;
  weeks: number;
  days: Day[];
  currentDayId: number | null;
  accentColor: string;
  logo: string | null;
  trainee: TraineeInfo;
  trainer: TrainerInfo;
  description: string;
}

// Define the type for the exercise database structure
export interface ExerciseDatabase {
  [key: string]: {
    name: string;
    equipment: string;
    difficulty: string;
    video?: string;
  }[];
}