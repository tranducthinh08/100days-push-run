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
}
