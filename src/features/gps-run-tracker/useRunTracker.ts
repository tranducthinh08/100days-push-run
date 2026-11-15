import { useState, useEffect, useRef, useCallback } from 'react';
import { GeoCoordinate, calculateHaversineDistance, calculatePace } from '@/shared/lib/geo';
import { playBeep } from '@/shared/lib/audio';
import { triggerVibration } from '@/shared/lib/vibrate';

export interface KmSplit {
  km: number;
  durationSec: number;
  pace: string;
}

export function useRunTracker() {
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentPace, setCurrentPace] = useState('--:-- /km');
  const [currentSpeedKmh, setCurrentSpeedKmh] = useState(0);
  const [splits, setSplits] = useState<KmSplit[]>([]);
  const [isSimulation, setIsSimulation] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const lastCoordRef = useRef<GeoCoordinate | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const lastKmRef = useRef<number>(0);
  const lastSplitTimeRef = useRef<number>(0);

  // Timer interval
  useEffect(() => {
    if (!isTracking || isPaused) return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);

      // In simulation mode, add ~2.77 meters per second (~10 km/h pace)
      if (isSimulation) {
        setDistanceMeters((prev) => {
          const nextDist = prev + 2.77;
          setCurrentSpeedKmh(10.0);
          return nextDist;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isTracking, isPaused, isSimulation]);

  // Update Pace and KM splits
  useEffect(() => {
    if (distanceMeters > 0 && elapsedSeconds > 0) {
      setCurrentPace(calculatePace(distanceMeters, elapsedSeconds));

      // Check KM split
      const currentKm = Math.floor(distanceMeters / 1000);
      if (currentKm > lastKmRef.current) {
        const splitDuration = elapsedSeconds - lastSplitTimeRef.current;
        const splitPace = calculatePace(1000, splitDuration);
        setSplits((prev) => [
          ...prev,
          { km: currentKm, durationSec: splitDuration, pace: splitPace },
        ]);
        lastKmRef.current = currentKm;
        lastSplitTimeRef.current = elapsedSeconds;
        // Chime for completing a KM
        playBeep(880, 0.15, 'sine');
        triggerVibration([200, 100, 200]);
      }
    }
  }, [distanceMeters, elapsedSeconds]);

  // Real GPS tracking via navigator.geolocation
  useEffect(() => {
    if (!isTracking || isPaused || isSimulation) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    if (!('geolocation' in navigator)) {
      setGpsError('Thiết bị không hỗ trợ định vị GPS.');
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setGpsError(null);
        const { latitude, longitude, accuracy, speed } = pos.coords;
        if (accuracy && accuracy > 35) return; // Filter inaccurate readings

        const newCoord: GeoCoordinate = {
          latitude,
          longitude,
          timestamp: pos.timestamp,
          accuracy,
        };

        if (lastCoordRef.current) {
          const delta = calculateHaversineDistance(lastCoordRef.current, newCoord);
          if (delta > 1.5 && delta < 50) { // Filter micro-jitter or GPS jumps
            setDistanceMeters((d) => d + delta);
            if (speed !== null && speed >= 0) {
              setCurrentSpeedKmh(+(speed * 3.6).toFixed(1));
            }
          }
        }
        lastCoordRef.current = newCoord;
      },
      (err) => {
        setGpsError(`Lỗi định vị: ${err.message}`);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000,
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [isTracking, isPaused, isSimulation]);

  const startRun = useCallback(() => {
    setIsTracking(true);
    setIsPaused(false);
  }, []);

  const pauseRun = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeRun = useCallback(() => {
    setIsPaused(false);
  }, []);

  const resetRun = useCallback(() => {
    setIsTracking(false);
    setIsPaused(false);
    setDistanceMeters(0);
    setElapsedSeconds(0);
    setCurrentPace('--:-- /km');
    setCurrentSpeedKmh(0);
    setSplits([]);
    lastCoordRef.current = null;
    lastKmRef.current = 0;
    lastSplitTimeRef.current = 0;
  }, []);

  return {
    isTracking,
    isPaused,
    distanceKm: +(distanceMeters / 1000).toFixed(2),
    elapsedSeconds,
    currentPace,
    currentSpeedKmh,
    splits,
    isSimulation,
    gpsError,
    setIsSimulation,
    startRun,
    pauseRun,
    resumeRun,
    resetRun,
  };
}
