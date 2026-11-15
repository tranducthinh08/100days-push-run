import { useState, useEffect, useCallback, useRef } from 'react';
import { playTimerEndSound } from '@/shared/lib/audio';
import { vibrateTimerEnd } from '@/shared/lib/vibrate';

export interface UseRestTimerProps {
  onComplete?: () => void;
}

export function useRestTimer({ onComplete }: UseRestTimerProps = {}) {
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [initialSeconds, setInitialSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const start = useCallback((durationSec: number) => {
    setInitialSeconds(durationSec);
    setSecondsRemaining(durationSec);
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resume = useCallback(() => {
    if (secondsRemaining > 0) {
      setIsRunning(true);
    }
  }, [secondsRemaining]);

  const skip = useCallback(() => {
    setIsRunning(false);
    setSecondsRemaining(0);
    if (onCompleteRef.current) {
      onCompleteRef.current();
    }
  }, []);

  const adjust = useCallback((deltaSec: number) => {
    setSecondsRemaining((prev) => Math.max(0, prev + deltaSec));
  }, []);

  useEffect(() => {
    if (!isRunning || secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          // Play sound and trigger vibration
          playTimerEndSound();
          vibrateTimerEnd();
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, secondsRemaining]);

  return {
    secondsRemaining,
    initialSeconds,
    isRunning,
    start,
    pause,
    resume,
    skip,
    adjust,
  };
}
