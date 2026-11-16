import { useState, useEffect, useCallback, useRef } from 'react';
import { SyncStatus } from './syncTypes';
import {
  getStoredSyncPin,
  saveSyncPin,
  generateRandomPin,
  executeTwoWaySync,
  fetchCloudData,
} from './syncService';
import {
  isSupabaseConfigured,
  saveSupabaseConfig,
  getSupabaseConfig,
} from '@/shared/lib/supabaseClient';
import { UserProgressState } from '@/entities/user-progress/types';

export function useCloudSync() {
  const [syncPin, setSyncPinState] = useState<string>(() => getStoredSyncPin());
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(() =>
    isSupabaseConfigured() ? 'idle' : 'unconfigured'
  );
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    const handleOnline = () => {
      if (syncStatus === 'offline') {
        setSyncStatus(isSupabaseConfigured() ? 'idle' : 'unconfigured');
      }
    };
    const handleOffline = () => setSyncStatus('offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncStatus]);

  const syncNow = useCallback(
    async (
      currentState: UserProgressState,
      onStateUpdated?: (merged: UserProgressState) => void
    ) => {
      if (!isSupabaseConfigured()) {
        setSyncStatus('unconfigured');
        setErrorMessage('Vui lòng nhập Project URL & Anon Key ở bên dưới rồi bấm "Lưu cấu hình Supabase" trước!');
        return;
      }
      if (!navigator.onLine) {
        setSyncStatus('offline');
        setErrorMessage('Thiết bị đang không có kết nối Internet.');
        return;
      }
      if (isSyncingRef.current) return;

      isSyncingRef.current = true;
      setSyncStatus('syncing');
      setErrorMessage(null);

      const res = await executeTwoWaySync(currentState, syncPin);
      isSyncingRef.current = false;

      if (res.success && res.mergedState) {
        setSyncStatus('synced');
        setLastSyncedAt(res.lastSyncedAt || new Date().toISOString());
        if (onStateUpdated) {
          onStateUpdated(res.mergedState);
        }
      } else {
        setSyncStatus('error');
        setErrorMessage(res.message || 'Lỗi đồng bộ');
      }
    },
    [syncPin]
  );

  const linkNewPin = useCallback(
    async (
      newPin: string,
      onStateUpdated?: (merged: UserProgressState) => void
    ) => {
      const cleanPin = newPin.trim().toUpperCase();
      if (!cleanPin) return;
      saveSyncPin(cleanPin);
      setSyncPinState(cleanPin);

      if (!isSupabaseConfigured()) {
        setSyncStatus('unconfigured');
        return;
      }

      setSyncStatus('syncing');
      const cloudData = await fetchCloudData(cleanPin);
      if (cloudData && onStateUpdated) {
        onStateUpdated(cloudData);
        setSyncStatus('synced');
        setLastSyncedAt(new Date().toISOString());
      } else {
        setSyncStatus('idle');
      }
    },
    []
  );

  const updateCredentials = useCallback((url: string, key: string) => {
    saveSupabaseConfig(url, key);
    setSyncStatus(isSupabaseConfigured() ? 'idle' : 'unconfigured');
  }, []);

  const resetPin = useCallback(() => {
    const newPin = generateRandomPin();
    saveSyncPin(newPin);
    setSyncPinState(newPin);
  }, []);

  return {
    syncPin,
    syncStatus,
    lastSyncedAt,
    errorMessage,
    isConfigured: isSupabaseConfigured(),
    config: getSupabaseConfig(),
    syncNow,
    linkNewPin,
    updateCredentials,
    resetPin,
  };
}
