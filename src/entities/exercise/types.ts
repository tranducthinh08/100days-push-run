export type EquipmentType = 'dumbbell' | 'bodyweight';

export type ExerciseCategory =
  | 'warm-up'
  | 'main-push'
  | 'pull-prehab'
  | 'triceps'
  | 'leg-prehab'
  | 'core-mobility';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  equipment: EquipmentType;
  fallbackId?: string;
  targetMuscles: string[];
  cues: string[];
  youtubeId?: string;
  animationType?: string;
  videoTip?: string;
}

export interface ExerciseBlockItem {
  exerciseId: string;
  targetSets: number;
  targetReps: string; // e.g. "12 reps", "Max Reps", "45s", "15 reps/side"
  restSeconds: number;
  note?: string;
}

export interface ResolvedExerciseItem extends ExerciseBlockItem {
  exercise: Exercise;
  isFallback: boolean;
  originalExerciseId?: string;
}
