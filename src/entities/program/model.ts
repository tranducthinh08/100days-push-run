import programData from '@/shared/data/program.json';
import { DayProgram, ProgramPhase } from './types';

export const PROGRAM_DAYS: DayProgram[] = programData as DayProgram[];

export const PROGRAM_MAP: Map<number, DayProgram> = new Map(
  PROGRAM_DAYS.map((day) => [day.dayNumber, day])
);

export function getProgramDay(dayNumber: number): DayProgram {
  const day = PROGRAM_MAP.get(dayNumber);
  if (!day) {
    return PROGRAM_DAYS[0];
  }
  return day;
}

export function getDaysByPhase(phase: ProgramPhase): DayProgram[] {
  return PROGRAM_DAYS.filter((d) => d.phase === phase);
}

export function getPhaseInfo(phase: ProgramPhase) {
  switch (phase) {
    case 1:
      return {
        title: 'Giai đoạn 1: Nền tảng & Thích nghi',
        weeks: 'Tuần 1 - 4 (Ngày 1 - 30)',
        goal: 'Xây dựng volume hít đất cơ bản (8-18 reps) & Tích lũy 20-40p chạy Zone 2',
        testGoal: 'Cuối tuần 4: Test Max Reps (Mục tiêu 25-30 cái)',
      };
    case 2:
      return {
        title: 'Giai đoạn 2: Tăng mật độ & Sức bền tốc độ',
        weeks: 'Tuần 5 - 10 (Ngày 31 - 70)',
        goal: 'Tăng số hiệp lên 20-32 reps, giảm thời gian nghỉ xuống 45s & Chạy Interval 400m',
        testGoal: 'Cuối tuần 10: Test Max Reps (Mục tiêu 60-65 cái)',
      };
    case 3:
      return {
        title: 'Giai đoạn 3: Đỉnh khối lượng & Chinh phục 100',
        weeks: 'Tuần 11 - 14 (Ngày 71 - 100)',
        goal: 'Đỉnh volume 70-80 cái hiệp 1, chạy dài 70 phút. Tuần 14 giảm tải (Tapering)',
        testGoal: 'Ngày 100: Thử thách 100 cái hít đất liên tục!',
      };
  }
}
