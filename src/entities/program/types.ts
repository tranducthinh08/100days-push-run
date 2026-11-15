import { ExerciseBlockItem } from '../exercise/types';

export type WorkoutDayType = 'push' | 'run' | 'recovery';

export type ProgramPhase = 1 | 2 | 3;

export interface RunIntervalConfig {
  workDurationSec: number; // e.g. 120s for 400m pace
  recoveryDurationSec: number; // e.g. 60s walk
  repetitions: number;
}

export interface RunDetails {
  durationMinutesTarget: number;
  distanceKmTarget?: number;
  runType: 'zone2' | 'interval' | 'long-run' | 'easy';
  paceGuidance: string;
  description: string;
  intervalConfig?: RunIntervalConfig;
}

export interface DayProgram {
  dayNumber: number; // 1 to 100
  weekNumber: number; // 1 to 14
  dayOfWeekIndex: number; // 0: Mon, 1: Tue, ..., 6: Sun
  dayOfWeekVi: string; // "Thứ 2", "Thứ 3", etc.
  phase: ProgramPhase;
  type: WorkoutDayType;
  title: string;
  focus: string;
  isTestDay: boolean;
  pushupTargetRepsPerSet?: number[];
  restBetweenSetsSec?: number;
  warmupBlock: ExerciseBlockItem[];
  mainBlock: ExerciseBlockItem[];
  accessoryBlock: ExerciseBlockItem[];
  runDetails?: RunDetails;
}
