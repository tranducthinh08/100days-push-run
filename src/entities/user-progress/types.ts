import { EquipmentType } from '../exercise/types';
import { WorkoutDayType } from '../program/types';

export interface WorkoutCompletionLog {
  dayNumber: number;
  completedAt: string; // ISO date
  type: WorkoutDayType;
  totalPushupsDone?: number;
  maxPushupsSet?: number;
  runDistanceKm?: number;
  runDurationSec?: number;
  runPace?: string;
  jumpRopeCount?: number;
  jumpRopeDurationSec?: number;
  cardioType?: 'run' | 'jump-rope';
  equipmentMode: EquipmentType;
  notes?: string;
}

export interface UserProgressState {
  currentDay: number; // 1-100
  equipmentMode: EquipmentType;
  completedDays: Record<number, WorkoutCompletionLog>;
  maxPushupsRecord: number;
  streak: number;
  lastActiveDate: string;
  startDate?: string; // YYYY-MM-DD challenge start date
  customExerciseVideos?: Record<string, string>;
}
