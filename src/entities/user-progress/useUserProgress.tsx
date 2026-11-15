import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { EquipmentType } from '../exercise/types';
import { UserProgressState, WorkoutCompletionLog } from './types';
import { getStorageItem, setStorageItem } from '@/shared/lib/storage';
import { getTodayDateStr, checkDisciplineStreakBroken, calculateAccurateStreak } from './disciplineHelper';

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
  resetAllProgress: () => void;
}

const UserProgressContext = createContext<UserProgressContextType | null>(null);

export function UserProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<UserProgressState>(() => {
    const loaded = getStorageItem<UserProgressState>(STORAGE_KEY, DEFAULT_STATE);
    const startDate = loaded.startDate || getTodayDateStr();
    const streak = calculateAccurateStreak(loaded.completedDays || {}, startDate);
    return { ...loaded, startDate, streak };
  });

  useEffect(() => {
    setStorageItem(STORAGE_KEY, state);
  }, [state]);

  const activeStartDate = state.startDate || getTodayDateStr();

  const disciplineStatus = useMemo(() => {
    return checkDisciplineStreakBroken(state.completedDays, activeStartDate);
  }, [state.completedDays, activeStartDate]);

  // Synchronize streak deterministically
  useEffect(() => {
    const accurateStreak = disciplineStatus.isBroken
      ? 0
      : calculateAccurateStreak(state.completedDays, activeStartDate);

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

  const setStartDate = (dateStr: string) => {
    setState((prev) => {
      const accurateStreak = calculateAccurateStreak(prev.completedDays, dateStr);
      return { ...prev, startDate: dateStr, streak: accurateStreak };
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
      const accurateStreak = calculateAccurateStreak(updatedCompleted, prev.startDate || getTodayDateStr());

      return {
        ...prev,
        currentDay: Math.min(prev.currentDay, dayNumber),
        streak: accurateStreak,
        completedDays: updatedCompleted,
      };
    });
  };

  const resetStreakAndRestart = (newStartDate?: string) => {
    const chosenStart = newStartDate || getTodayDateStr();
    setState((prev) => ({
      ...prev,
      currentDay: 1,
      streak: 0,
      startDate: chosenStart,
      completedDays: {},
    }));
  };

  const setCustomExerciseVideo = (exerciseId: string, urlOrId: string) => {
    setState((prev) => ({
      ...prev,
      customExerciseVideos: { ...(prev.customExerciseVideos || {}), [exerciseId]: urlOrId },
    }));
  };

  const completedList = Object.values(state.completedDays);
  const totalCompletedCount = completedList.length;
  const totalPushupsDone = completedList.reduce((acc, cur) => acc + (cur.totalPushupsDone || 0), 0);
  const totalRunKm = +completedList.reduce((acc, cur) => acc + (cur.runDistanceKm || 0), 0).toFixed(1);

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
        resetAllProgress,
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
