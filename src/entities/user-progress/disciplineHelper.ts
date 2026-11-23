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
 */
export function getElapsedDays(startDateStr: string, targetDateStr: string): number {
  if (!startDateStr || !targetDateStr) return 0;
  const d1 = parseDateOnly(startDateStr);
  const d2 = parseDateOnly(targetDateStr);
  const diffMs = d2.getTime() - d1.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Filters completed days so only days completed on or after startDate are retained.
 * Discards old days from previous failed challenges.
 */
export function filterCompletedDaysByStartDate(
  completedDays: Record<number, WorkoutCompletionLog>,
  startDateStr: string
): Record<number, WorkoutCompletionLog> {
  if (!startDateStr) return completedDays;
  const filtered: Record<number, WorkoutCompletionLog> = {};
  for (const [key, log] of Object.entries(completedDays || {})) {
    if (!log || !log.completedAt) continue;
    const logDate = log.completedAt.substring(0, 10);
    if (logDate >= startDateStr) {
      filtered[Number(key)] = log;
    }
  }
  return filtered;
}

/**
 * Checks whether any day between startDate and yesterday was missed.
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

  if (elapsed <= 0) {
    return { isBroken: false, missedDay: null, expectedDayToday: 1 };
  }

  // Check every day from Day 1 to Day `elapsed` (yesterday)
  for (let day = 1; day <= elapsed; day++) {
    const log = completedDays[day];
    const isDone = Boolean(log && (!startDateStr || !log.completedAt || log.completedAt.substring(0, 10) >= startDateStr));
    if (!isDone) {
      return { isBroken: true, missedDay: day, expectedDayToday };
    }
  }

  return { isBroken: false, missedDay: null, expectedDayToday };
}

/**
 * Calculates current consecutive streak accurately from completedDays.
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
  for (let day = 1; day <= expectedDayToday; day++) {
    const log = completedDays[day];
    const isDone = Boolean(log && (!startDateStr || !log.completedAt || log.completedAt.substring(0, 10) >= startDateStr));
    if (isDone) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
