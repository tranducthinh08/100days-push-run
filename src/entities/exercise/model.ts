import exercisesData from '@/shared/data/exercises.json';
import { Exercise, EquipmentType, ExerciseBlockItem, ResolvedExerciseItem } from './types';

export const EXERCISES: Exercise[] = exercisesData as Exercise[];

export const EXERCISE_MAP: Map<string, Exercise> = new Map(
  EXERCISES.map((ex) => [ex.id, ex])
);

export function getExerciseById(id: string): Exercise | undefined {
  return EXERCISE_MAP.get(id);
}

/**
 * Resolves an exercise based on user's equipment setting.
 * If user is on 'bodyweight' mode and exercise is 'dumbbell',
 * we check if a fallbackId exists and return the fallback exercise.
 */
export function resolveExercise(
  blockItem: ExerciseBlockItem,
  equipmentMode: EquipmentType
): ResolvedExerciseItem {
  const original = getExerciseById(blockItem.exerciseId);
  if (!original) {
    throw new Error(`Exercise with ID "${blockItem.exerciseId}" not found in exercises.json`);
  }

  if (equipmentMode === 'bodyweight' && original.equipment === 'dumbbell' && original.fallbackId) {
    const fallback = getExerciseById(original.fallbackId);
    if (fallback) {
      return {
        ...blockItem,
        exercise: fallback,
        isFallback: true,
        originalExerciseId: original.id,
      };
    }
  }

  return {
    ...blockItem,
    exercise: original,
    isFallback: false,
  };
}

export function filterExercisesByCategory(category: string): Exercise[] {
  return EXERCISES.filter((ex) => ex.category === category);
}
