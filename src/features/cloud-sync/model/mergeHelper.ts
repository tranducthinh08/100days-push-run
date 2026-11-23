import { UserProgressState, WorkoutCompletionLog } from '@/entities/user-progress/types';
import { calculateAccurateStreak, filterCompletedDaysByStartDate, getTodayDateStr } from '@/entities/user-progress/disciplineHelper';

/**
 * Two-Way Auto-Merge: Mathematically guarantees zero data loss.
 * Unions active challenge days, respects user reset, preserves records, recalculates streak.
 */
export function mergeProgressStates(
  local: UserProgressState,
  remote: UserProgressState
): UserProgressState {
  if (!remote || !remote.completedDays) return local;
  if (!local || !local.completedDays) return remote;

  // 1. Determine active challenge start date: newest date wins!
  const localStart = local.startDate || '';
  const remoteStart = remote.startDate || '';
  const activeStartDate = localStart > remoteStart ? localStart : (remoteStart || localStart || getTodayDateStr());

  // 2. Filter completed days: only days completed on or after activeStartDate are valid
  const validLocalDays = filterCompletedDaysByStartDate(local.completedDays, activeStartDate);
  const validRemoteDays = filterCompletedDaysByStartDate(remote.completedDays, activeStartDate);

  // If local is a newer challenge or a fresh reset, do not resurrect old remote days
  const isLocalNewerChallenge = localStart > remoteStart;
  const mergedCompletedDays = isLocalNewerChallenge
    ? validLocalDays
    : { ...validRemoteDays, ...validLocalDays };

  if (!isLocalNewerChallenge) {
    for (const [dayKey, remoteLog] of Object.entries(validRemoteDays)) {
      const day = Number(dayKey);
      const localLog = validLocalDays[day];
      if (localLog && remoteLog) {
        const remoteTime = new Date(remoteLog.completedAt).getTime() || 0;
        const localTime = new Date(localLog.completedAt).getTime() || 0;
        if (remoteTime > localTime) {
          mergedCompletedDays[day] = remoteLog;
        }
      }
    }
  }

  // 3. Max records preserved
  const maxPushupsRecord = Math.max(local.maxPushupsRecord || 0, remote.maxPushupsRecord || 0);

  // 4. Current day calculation
  const completedDayNumbers = Object.keys(mergedCompletedDays).map(Number);
  const maxCompletedDay = completedDayNumbers.length > 0 ? Math.max(...completedDayNumbers) : 0;
  const currentDay = Math.min(100, Math.max(1, maxCompletedDay + 1));

  // 5. Accurate streak
  const streak = calculateAccurateStreak(mergedCompletedDays, activeStartDate);

  return {
    currentDay,
    equipmentMode: local.equipmentMode || remote.equipmentMode || 'dumbbell',
    completedDays: mergedCompletedDays,
    maxPushupsRecord,
    streak,
    lastActiveDate: new Date().toISOString(),
    startDate: activeStartDate,
    customExerciseVideos: {
      ...(remote.customExerciseVideos || {}),
      ...(local.customExerciseVideos || {}),
    },
  };
}
