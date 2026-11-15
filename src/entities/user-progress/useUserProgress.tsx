import React, { createContext, useContext, useState, useEffect } from 'react';
import { EquipmentType } from '../exercise/types';
import { UserProgressState, WorkoutCompletionLog } from './types';
import { getStorageItem, setStorageItem } from '@/shared/lib/storage';

const STORAGE_KEY = 'user_progress_state';

const DEFAULT_STATE: UserProgressState = {
  currentDay: 1,
  equipmentMode: 'dumbbell',
  completedDays: {},
  maxPushupsRecord: 0,
  streak: 0,
  lastActiveDate: '',
  customExerciseVideos: {},
};

interface UserProgressContextType {
  state: UserProgressState;
  currentDay: number;
  equipmentMode: EquipmentType;
  maxPushupsRecord: number;
  streak: number;
  completedDays: Record<number, WorkoutCompletionLog>;
  totalCompletedCount: number;
  totalPushupsDone: number;
  totalRunKm: number;
  customExerciseVideos: Record<string, string>;
  setCurrentDay: (day: number) => void;
  toggleEquipmentMode: () => void;
  setEquipmentMode: (mode: EquipmentType) => void;
  markDayCompleted: (log: WorkoutCompletionLog) => void;
  updateMaxPushupsRecord: (reps: number) => void;
  setCustomExerciseVideo: (exerciseId: string, urlOrId: string) => void;
  resetAllProgress: () => void;
}

const UserProgressContext = createContext<UserProgressContextType | null>(null);

export function UserProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<UserProgressState>(() =>
    getStorageItem<UserProgressState>(STORAGE_KEY, DEFAULT_STATE)
  );

  useEffect(() => {
    setStorageItem(STORAGE_KEY, state);
  }, [state]);

  const setCurrentDay = (day: number) => {
    setState((prev) => ({
      ...prev,
      currentDay: Math.min(100, Math.max(1, day)),
    }));
  };

  const setEquipmentMode = (mode: EquipmentType) => {
    setState((prev) => ({ ...prev, equipmentMode: mode }));
  };

  const toggleEquipmentMode = () => {
    setState((prev) => ({
      ...prev,
      equipmentMode: prev.equipmentMode === 'dumbbell' ? 'bodyweight' : 'dumbbell',
    }));
  };

  const updateMaxPushupsRecord = (reps: number) => {
    setState((prev) => ({
      ...prev,
      maxPushupsRecord: Math.max(prev.maxPushupsRecord, reps),
    }));
  };

  const setCustomExerciseVideo = (exerciseId: string, urlOrId: string) => {
    setState((prev) => ({
      ...prev,
      customExerciseVideos: {
        ...(prev.customExerciseVideos || {}),
        [exerciseId]: urlOrId,
      },
    }));
  };

  const markDayCompleted = (log: WorkoutCompletionLog) => {
    setState((prev) => {
      const today = new Date().toISOString().slice(0, 10);
      const isConsecutive =
        prev.lastActiveDate &&
        (new Date(today).getTime() - new Date(prev.lastActiveDate).getTime() <= 86400000 * 2);

      const nextStreak = isConsecutive ? prev.streak + 1 : 1;
      const nextMax = log.maxPushupsSet
        ? Math.max(prev.maxPushupsRecord, log.maxPushupsSet)
        : prev.maxPushupsRecord;

      const nextCurrent = prev.currentDay === log.dayNumber && log.dayNumber < 100
        ? log.dayNumber + 1
        : prev.currentDay;

      return {
        ...prev,
        currentDay: nextCurrent,
        streak: nextStreak,
        lastActiveDate: today,
        maxPushupsRecord: nextMax,
        completedDays: {
          ...prev.completedDays,
          [log.dayNumber]: log,
        },
      };
    });
  };

  const resetAllProgress = () => {
    setState(DEFAULT_STATE);
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
        completedDays: state.completedDays,
        totalCompletedCount,
        totalPushupsDone,
        totalRunKm,
        customExerciseVideos: state.customExerciseVideos || {},
        setCurrentDay,
        toggleEquipmentMode,
        setEquipmentMode,
        markDayCompleted,
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
  if (!ctx) {
    throw new Error('useUserProgress must be used within UserProgressProvider');
  }
  return ctx;
}
