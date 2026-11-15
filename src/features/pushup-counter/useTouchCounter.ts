import { useState, useCallback } from 'react';
import { playBeep, playSetCompleteSound } from '@/shared/lib/audio';
import { triggerVibration, vibrateSetComplete } from '@/shared/lib/vibrate';

export interface UseTouchCounterProps {
  initialCount?: number;
  targetReps?: number;
  onSetCompleted?: (completedReps: number) => void;
}

export function useTouchCounter({
  initialCount = 0,
  targetReps,
  onSetCompleted,
}: UseTouchCounterProps = {}) {
  const [count, setCount] = useState(initialCount);
  const [isPressed, setIsPressed] = useState(false);

  const increment = useCallback(() => {
    setCount((prev) => {
      const next = prev + 1;
      // Play 880Hz crisp synthesizer beep
      playBeep(880, 0.08, 'sine');
      // Subtle 40ms haptic tap
      triggerVibration(40);

      if (targetReps && next === targetReps) {
        // Target achieved!
        playSetCompleteSound();
        vibrateSetComplete();
        if (onSetCompleted) {
          onSetCompleted(next);
        }
      }
      return next;
    });
  }, [targetReps, onSetCompleted]);

  const decrement = useCallback(() => {
    setCount((prev) => Math.max(0, prev - 1));
  }, []);

  const reset = useCallback((newCount = 0) => {
    setCount(newCount);
  }, []);

  const handleTouchStart = useCallback(() => {
    setIsPressed(true);
    increment();
  }, [increment]);

  const handleTouchEnd = useCallback(() => {
    setIsPressed(false);
  }, []);

  return {
    count,
    setCount,
    increment,
    decrement,
    reset,
    isPressed,
    handleTouchStart,
    handleTouchEnd,
  };
}
