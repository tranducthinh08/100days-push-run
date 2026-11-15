/**
 * Mobile vibration helper with safe fallback
 */

export function triggerVibration(pattern: number | number[] = 100): boolean {
  if (typeof window === 'undefined' || !navigator.vibrate) {
    return false;
  }
  try {
    return navigator.vibrate(pattern);
  } catch (err) {
    console.warn('Vibration failed:', err);
    return false;
  }
}

export function vibrateSetComplete(): void {
  triggerVibration([150, 80, 150]);
}

export function vibrateTimerEnd(): void {
  triggerVibration([200, 100, 200, 100, 300]);
}
