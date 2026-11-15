import { WorkoutCompletionLog } from './types';

/**
 * Returns today's date in local 'YYYY-MM-DD' format without timezone shifts.
 */
export function getTodayDateStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Parses 'YYYY-MM-DD' into a local Date object.
 */
export function parseDateOnly(dateStr: string): Date {
  const parts = dateStr.split('-');
  const y = Number(parts[0]) || 2026;
  const m = Number(parts[1]) || 1;
  const d = Number(parts[2]) || 1;
  return new Date(y, m - 1, d);
}

/**
 * Formats 'YYYY-MM-DD' into Vietnamese format 'DD/MM/YYYY'.
 */
export function formatDateVi(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length < 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

/**
 * Calculates how many days elapsed between startDate and targetDate.
 * If targetDate === startDate, returns 0 (Day 1).
 */
export function getElapsedDays(startDateStr: string, targetDateStr: string): number {
  if (!startDateStr || !targetDateStr) return 0;
  const d1 = parseDateOnly(startDateStr);
  const d2 = parseDateOnly(targetDateStr);
  const diffMs = d2.getTime() - d1.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Checks whether any day between startDate and yesterday was missed.
 * If yesterday was Day K and any day from 1 to K was not completed,
 * then the discipline streak is broken!
 */
export function checkDisciplineStreakBroken(
  completedDays: Record<number, WorkoutCompletionLog>,
  startDateStr: string,
  todayStr: string = getTodayDateStr()
): { isBroken: boolean; missedDay: number | null; expectedDayToday: number } {
  if (!startDateStr) {
    return { isBroken: false, missedDay: null, expectedDayToday: 1 };
  }

  const elapsed = getElapsedDays(startDateStr, todayStr);
  const expectedDayToday = Math.min(100, Math.max(1, elapsed + 1));

  // If today is before startDate
  if (elapsed < 0) {
    return { isBroken: false, missedDay: null, expectedDayToday: 1 };
  }

  // If today is Day 1 (elapsed === 0), no past day exists to miss
  if (elapsed === 0) {
    return { isBroken: false, missedDay: null, expectedDayToday: 1 };
  }

  // Check every day from Day 1 to Day `elapsed` (yesterday)
  for (let day = 1; day <= elapsed; day++) {
    if (!completedDays[day]) {
      return { isBroken: true, missedDay: day, expectedDayToday };
    }
  }

  return { isBroken: false, missedDay: null, expectedDayToday };
}

/**
 * Calculates current consecutive streak accurately from completedDays.
 * Does not increase when clicking multiple times on the same day.
 */
export function calculateAccurateStreak(
  completedDays: Record<number, WorkoutCompletionLog>,
  startDateStr: string,
  todayStr: string = getTodayDateStr()
): number {
  const { isBroken, expectedDayToday } = checkDisciplineStreakBroken(
    completedDays,
    startDateStr,
    todayStr
  );

  if (isBroken) return 0;

  let streak = 0;
  // Count consecutive completed days starting from Day 1 up to expectedDayToday
  for (let day = 1; day <= expectedDayToday; day++) {
    if (completedDays[day]) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
