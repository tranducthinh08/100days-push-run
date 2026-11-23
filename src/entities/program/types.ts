import { ExerciseBlockItem } from '../exercise/types';

export type WorkoutDayType = 'push' | 'run' | 'recovery';

export type ProgramPhase = 1 | 2 | 3;

export interface RunIntervalConfig {
  workDurationSec: number; // e.g. 120s for 400m pace
  recoveryDurationSec: number; // e.g. 60s walk
  repetitions: number;
}

export interface RunRepSplit {
  setNumber: number;
  label: string; // e.g. "Hiệp 1"
  work: string; // e.g. "4 phút chạy nhẹ (~700m)"
  pace: string; // e.g. "Pace 7:00 (Zone 2)"
  rest: string; // e.g. "60s đi bộ thả lỏng"
}

export interface RunDetails {
  durationMinutesTarget: number;
  distanceKmTarget?: number;
  jumpRopeTargetReps?: number;
  runType: 'zone2' | 'interval' | 'long-run' | 'easy';
  paceGuidance: string;
  description: string;
  cadenceGuidance?: string;
  heartRateZone?: string;
  intervalConfig?: RunIntervalConfig;
  splitsSummary?: string;
  splits?: RunRepSplit[];
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
