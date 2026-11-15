import React, { useState, useEffect } from 'react';
import { ArrowLeft, Keyboard } from 'lucide-react';
import { useUserProgress } from '@/entities/user-progress/useUserProgress';
import { getProgramDay } from '@/entities/program/model';
import { resolveExercise } from '@/entities/exercise/model';
import { useTouchCounter } from '@/features/pushup-counter/useTouchCounter';
import { TouchCounterPad } from '@/features/pushup-counter/TouchCounterPad';
import { useRestTimer } from '@/features/rest-timer/useRestTimer';
import { RestTimerModal } from '@/features/rest-timer/RestTimerModal';
import { BreathingCueBanner } from './components/BreathingCueBanner';
import { SetProgressTracker } from './components/SetProgressTracker';
import { WorkoutBlockChecklist } from './components/WorkoutBlockChecklist';
import { SessionCompletionBanner } from '@/features/workout-logger/SessionCompletionBanner';
import { requestWakeLock, releaseWakeLock } from '@/shared/lib/wakeLock';

interface WorkoutSessionPageProps {
  onBackToDashboard: () => void;
}

export function WorkoutSessionPage({ onBackToDashboard }: WorkoutSessionPageProps) {
  const { currentDay, equipmentMode, markDayCompleted } = useUserProgress();
  const programDay = getProgramDay(currentDay);

  const rawSets = programDay.pushupTargetRepsPerSet && programDay.pushupTargetRepsPerSet.length > 0
    ? programDay.pushupTargetRepsPerSet
    : [15, 12, 10, 10, 8];

  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState<number[]>([]);
  const [isSessionFinished, setIsSessionFinished] = useState(false);

  const targetReps = rawSets[currentSetIndex] || 10;
  const restTimeSec = programDay.restBetweenSetsSec || 60;

  const warmupResolved = programDay.warmupBlock.map((i) => resolveExercise(i, equipmentMode));
  const accessoryResolved = programDay.accessoryBlock.map((i) => resolveExercise(i, equipmentMode));

  useEffect(() => {
    requestWakeLock();
    return () => {
      releaseWakeLock();
    };
  }, []);

  const {
    secondsRemaining,
    initialSeconds,
    isRunning: isTimerRunning,
    start: startTimer,
    skip: skipTimer,
    adjust: adjustTimer,
  } = useRestTimer({
    onComplete: () => {
      proceedToNextSet();
    },
  });

  const proceedToNextSet = () => {
    if (currentSetIndex + 1 < rawSets.length) {
      setCurrentSetIndex((prev) => prev + 1);
      touchCounter.reset(0);
    } else {
      finishWorkout();
    }
  };

  const handleSetCompleted = (actualReps: number) => {
    const updated = [...completedSets, actualReps];
    setCompletedSets(updated);

    if (currentSetIndex + 1 < rawSets.length) {
      startTimer(restTimeSec);
    } else {
      finishWorkout(updated);
    }
  };

  const finishWorkout = (finalSets = completedSets) => {
    const totalDone = finalSets.reduce((a, b) => a + b, 0);
    const maxRep = Math.max(...finalSets, 0);

    markDayCompleted({
      dayNumber: currentDay,
      completedAt: new Date().toISOString(),
      type: 'push',
      totalPushupsDone: totalDone,
      maxPushupsSet: maxRep,
      equipmentMode,
    });
    setIsSessionFinished(true);
  };

  const touchCounter = useTouchCounter({
    initialCount: 0,
    targetReps,
    onSetCompleted: (reps) => {
      handleSetCompleted(reps);
    },
  });

  // Spacebar keyboard support on desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isTimerRunning && !isSessionFinished) {
        e.preventDefault();
        touchCounter.increment();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [touchCounter, isTimerRunning, isSessionFinished]);

  if (isSessionFinished) {
    const totalDone = completedSets.reduce((a, b) => a + b, 0);
    const maxRep = Math.max(...completedSets, 0);
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <SessionCompletionBanner
          dayNumber={currentDay}
          totalPushups={totalDone}
          maxRepsSet={maxRep}
          onFinish={onBackToDashboard}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-16 gap-4 pt-2">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Thoát buổi tập
        </button>

        <div className="flex items-center gap-3">
          <span className="hidden md:flex items-center gap-1.5 text-[11px] text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1 rounded-xl font-medium">
            <Keyboard className="w-3.5 h-3.5 text-orange-600" /> Bấm phím Space để đếm rep
          </span>
          <span className="text-xs font-bold text-orange-600 font-condensed tracking-wide">
            Ngày {currentDay} &bull; {programDay.title}
          </span>
        </div>
      </div>

      {/* Responsive Workstation Grid: 2 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Guidelines, Checklists, Set Tracker (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3.5">
          <BreathingCueBanner />

          {warmupResolved.length > 0 && (
            <WorkoutBlockChecklist
              title="1. Khởi động (5 phút)"
              items={warmupResolved}
              color="emerald"
            />
          )}

          <div className="bg-white border border-slate-200/90 rounded-3xl p-4 flex flex-col gap-2.5 shadow-sm">
            <span className="text-xs font-bold text-slate-800">
              Tiến độ từng hiệp hôm nay:
            </span>
            <SetProgressTracker
              sets={rawSets}
              completedSets={completedSets}
              currentSetIndex={currentSetIndex}
            />
          </div>

          {accessoryResolved.length > 0 && (
            <WorkoutBlockChecklist
              title="3. Bổ trợ & Giãn cơ (10 phút)"
              items={accessoryResolved}
              color="sky"
            />
          )}
        </div>

        {/* Right Column: Giant Touch / Spacebar Counter Pad (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <TouchCounterPad
            count={touchCounter.count}
            targetReps={targetReps}
            currentSetIndex={currentSetIndex}
            totalSets={rawSets.length}
            isPressed={touchCounter.isPressed}
            onIncrement={touchCounter.increment}
            onDecrement={touchCounter.decrement}
            onCompleteSet={() => handleSetCompleted(touchCounter.count)}
            onTouchStart={touchCounter.handleTouchStart}
            onTouchEnd={touchCounter.handleTouchEnd}
          />
        </div>
      </div>

      {/* Rest Timer Modal */}
      <RestTimerModal
        isOpen={isTimerRunning}
        secondsRemaining={secondsRemaining}
        initialSeconds={initialSeconds}
        onSkip={skipTimer}
        onAdjust={adjustTimer}
      />
    </div>
  );
}
export default WorkoutSessionPage;
