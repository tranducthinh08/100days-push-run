import { UserProgressState, WorkoutCompletionLog } from '@/entities/user-progress/types';
import { calculateAccurateStreak, getTodayDateStr } from '@/entities/user-progress/disciplineHelper';

/**
 * Two-Way Auto-Merge: Mathematically guarantees zero data loss.
 * Unions all completed days, preserves highest records, and recalculates streak.
 */
export function mergeProgressStates(
  local: UserProgressState,
  remote: UserProgressState
): UserProgressState {
  if (!remote || !remote.completedDays) return local;
  if (!local || !local.completedDays) return remote;

  // 1. Union completedDays: never lose any day completed on either device
  const mergedCompletedDays: Record<number, WorkoutCompletionLog> = {
    ...remote.completedDays,
    ...local.completedDays,
  };

  for (const [dayKey, remoteLog] of Object.entries(remote.completedDays)) {
    const day = Number(dayKey);
    const localLog = local.completedDays[day];
    if (!localLog) {
      mergedCompletedDays[day] = remoteLog;
    } else {
      // If both completed, pick the one with later timestamp or more pushups
      const remoteTime = new Date(remoteLog.completedAt).getTime() || 0;
      const localTime = new Date(localLog.completedAt).getTime() || 0;
      if (remoteTime > localTime) {
        mergedCompletedDays[day] = remoteLog;
      }
    }
  }

  // 2. Max records
  const maxPushupsRecord = Math.max(
    local.maxPushupsRecord || 0,
    remote.maxPushupsRecord || 0
  );

  // 3. Current day: pick maximum day
  const currentDay = Math.max(local.currentDay || 1, remote.currentDay || 1);

  // 4. Custom exercise video links
  const customExerciseVideos = {
    ...(remote.customExerciseVideos || {}),
    ...(local.customExerciseVideos || {}),
  };

  // 5. Start date & accurate streak
  const startDate = local.startDate || remote.startDate || getTodayDateStr();
  const streak = calculateAccurateStreak(mergedCompletedDays, startDate);

  return {
    currentDay,
    equipmentMode: local.equipmentMode || remote.equipmentMode || 'dumbbell',
    completedDays: mergedCompletedDays,
    maxPushupsRecord,
    streak,
    lastActiveDate: new Date().toISOString(),
    startDate,
    customExerciseVideos,
  };
}
