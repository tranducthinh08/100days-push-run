import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { EquipmentType } from '../exercise/types';
import { UserProgressState, WorkoutCompletionLog } from './types';
import { getStorageItem, setStorageItem } from '@/shared/lib/storage';
import { getTodayDateStr, checkDisciplineStreakBroken, calculateAccurateStreak, filterCompletedDaysByStartDate } from './disciplineHelper';

const STORAGE_KEY = 'user_progress_state';

const DEFAULT_STATE: UserProgressState = {
  currentDay: 1,
  equipmentMode: 'dumbbell',
  completedDays: {},
  maxPushupsRecord: 0,
  streak: 0,
  lastActiveDate: '',
  startDate: getTodayDateStr(),
  customExerciseVideos: {},
};

interface UserProgressContextType {
  state: UserProgressState;
  currentDay: number;
  equipmentMode: EquipmentType;
  maxPushupsRecord: number;
  streak: number;
  startDate: string;
  isStreakBroken: boolean;
  missedDay: number | null;
  expectedDayToday: number;
  completedDays: Record<number, WorkoutCompletionLog>;
  totalCompletedCount: number;
  totalPushupsDone: number;
  totalRunKm: number;
  totalJumpRopeCount: number;
  customExerciseVideos: Record<string, string>;
  setCurrentDay: (day: number) => void;
  setStartDate: (dateStr: string) => void;
  toggleEquipmentMode: () => void;
  setEquipmentMode: (mode: EquipmentType) => void;
  markDayCompleted: (log: WorkoutCompletionLog) => void;
  unmarkDayCompleted: (dayNumber: number) => void;
  resetStreakAndRestart: (newStartDate?: string) => void;
  updateMaxPushupsRecord: (reps: number) => void;
  setCustomExerciseVideo: (exerciseId: string, urlOrId: string) => void;
  replaceState: (newState: UserProgressState) => void;
  resetAllProgress: () => void;
  recordJumpRopeWorkout: (dayNumber: number, count: number, durationSec: number, notes?: string) => void;
}

const UserProgressContext = createContext<UserProgressContextType | null>(null);

export function UserProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<UserProgressState>(() => {
    const loaded = getStorageItem<UserProgressState>(STORAGE_KEY, DEFAULT_STATE);
    const startDate = loaded.startDate || getTodayDateStr();
    const validDays = filterCompletedDaysByStartDate(loaded.completedDays || {}, startDate);
    const streak = calculateAccurateStreak(validDays, startDate);
    const dayNums = Object.keys(validDays).map(Number);
    const maxDay = dayNums.length > 0 ? Math.max(...dayNums) : 0;
    return { ...loaded, startDate, streak, currentDay: Math.min(100, Math.max(1, maxDay + 1)), completedDays: validDays };
  });

  useEffect(() => { setStorageItem(STORAGE_KEY, state); }, [state]);

  const activeStartDate = state.startDate || getTodayDateStr();
  const disciplineStatus = useMemo(
    () => checkDisciplineStreakBroken(state.completedDays, activeStartDate),
    [state.completedDays, activeStartDate]
  );

  // Synchronize streak deterministically
  useEffect(() => {
    const accurateStreak = disciplineStatus.isBroken ? 0 : calculateAccurateStreak(state.completedDays, activeStartDate);
    if (state.streak !== accurateStreak) {
      setState((prev) => ({
        ...prev,
        streak: accurateStreak,
        currentDay: disciplineStatus.isBroken ? 1 : prev.currentDay,
      }));
    }
  }, [state.completedDays, activeStartDate, disciplineStatus.isBroken]);

  const setCurrentDay = (day: number) => setState((p) => ({ ...p, currentDay: Math.min(100, Math.max(1, day)) }));
  const setEquipmentMode = (mode: EquipmentType) => setState((p) => ({ ...p, equipmentMode: mode }));
  const toggleEquipmentMode = () => setState((p) => ({ ...p, equipmentMode: p.equipmentMode === 'dumbbell' ? 'bodyweight' : 'dumbbell' }));
  const updateMaxPushupsRecord = (reps: number) => setState((p) => ({ ...p, maxPushupsRecord: Math.max(p.maxPushupsRecord, reps) }));
  const resetAllProgress = () => setState(DEFAULT_STATE);
  const replaceState = (newState: UserProgressState) => setState(newState);
  const setCustomExerciseVideo = (exerciseId: string, urlOrId: string) =>
    setState((prev) => ({ ...prev, customExerciseVideos: { ...(prev.customExerciseVideos || {}), [exerciseId]: urlOrId } }));

  const setStartDate = (dateStr: string) => {
    setState((prev) => {
      const validDays = filterCompletedDaysByStartDate(prev.completedDays, dateStr);
      const streak = calculateAccurateStreak(validDays, dateStr);
      const dayNums = Object.keys(validDays).map(Number);
      const maxDay = dayNums.length > 0 ? Math.max(...dayNums) : 0;
      return {
        ...prev,
        startDate: dateStr,
        streak,
        currentDay: Math.min(100, Math.max(1, maxDay + 1)),
        completedDays: validDays,
        lastActiveDate: new Date().toISOString(),
      };
    });
  };

  const markDayCompleted = (log: WorkoutCompletionLog) => {
    setState((prev) => {
      const today = getTodayDateStr();
      const updatedCompleted = { ...prev.completedDays, [log.dayNumber]: log };
      const accurateStreak = calculateAccurateStreak(updatedCompleted, prev.startDate || today);
      const nextMax = log.maxPushupsSet ? Math.max(prev.maxPushupsRecord, log.maxPushupsSet) : prev.maxPushupsRecord;
      const nextCurrent = prev.currentDay === log.dayNumber && log.dayNumber < 100 ? log.dayNumber + 1 : prev.currentDay;
      return {
        ...prev,
        currentDay: nextCurrent,
        streak: accurateStreak,
        lastActiveDate: today,
        maxPushupsRecord: nextMax,
        completedDays: updatedCompleted,
      };
    });
  };

  const unmarkDayCompleted = (dayNumber: number) => {
    setState((prev) => {
      const updatedCompleted = { ...prev.completedDays };
      delete updatedCompleted[dayNumber];
      return {
        ...prev,
        currentDay: Math.min(prev.currentDay, dayNumber),
        streak: calculateAccurateStreak(updatedCompleted, prev.startDate || getTodayDateStr()),
        completedDays: updatedCompleted,
        lastActiveDate: new Date().toISOString(),
      };
    });
  };

  const resetStreakAndRestart = (newStartDate?: string) => {
    setState((prev) => ({
      ...prev,
      currentDay: 1,
      streak: 0,
      startDate: newStartDate || getTodayDateStr(),
      completedDays: {},
      lastActiveDate: new Date().toISOString(),
    }));
  };

  const recordJumpRopeWorkout = (dayNumber: number, count: number, durationSec: number, notes?: string) => {
    markDayCompleted({
      dayNumber,
      completedAt: new Date().toISOString(),
      type: 'run',
      cardioType: 'jump-rope',
      jumpRopeCount: count,
      jumpRopeDurationSec: durationSec,
      equipmentMode: state.equipmentMode,
      notes: notes || `Nhảy dây ${count.toLocaleString('vi-VN')} cái (${Math.round(durationSec / 60)} phút)`,
    });
  };

  const completedList = Object.values(state.completedDays);
  const totalCompletedCount = completedList.length;
  const totalPushupsDone = completedList.reduce((acc, cur) => acc + (cur.totalPushupsDone || 0), 0);
  const totalRunKm = +completedList.reduce((acc, cur) => acc + (cur.runDistanceKm || 0), 0).toFixed(1);
  const totalJumpRopeCount = completedList.reduce((acc, cur) => acc + (cur.jumpRopeCount || 0), 0);

  return (
    <UserProgressContext.Provider
      value={{
        state,
        currentDay: state.currentDay,
        equipmentMode: state.equipmentMode,
        maxPushupsRecord: state.maxPushupsRecord,
        streak: state.streak,
        startDate: activeStartDate,
        isStreakBroken: disciplineStatus.isBroken,
        missedDay: disciplineStatus.missedDay,
        expectedDayToday: disciplineStatus.expectedDayToday,
        completedDays: state.completedDays,
        totalCompletedCount,
        totalPushupsDone,
        totalRunKm,
        totalJumpRopeCount,
        customExerciseVideos: state.customExerciseVideos || {},
        setCurrentDay,
        setStartDate,
        toggleEquipmentMode,
        setEquipmentMode,
        markDayCompleted,
        unmarkDayCompleted,
        resetStreakAndRestart,
        updateMaxPushupsRecord,
        setCustomExerciseVideo,
        replaceState,
        resetAllProgress,
        recordJumpRopeWorkout,
      }}
    >
      {children}
    </UserProgressContext.Provider>
  );
}

export function useUserProgress(): UserProgressContextType {
  const ctx = useContext(UserProgressContext);
  if (!ctx) throw new Error('useUserProgress must be used within UserProgressProvider');
  return ctx;
}
