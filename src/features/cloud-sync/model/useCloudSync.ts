import { useState, useEffect, useCallback, useRef } from 'react';
import { SyncStatus } from './syncTypes';
import {
  getStoredSyncPin,
  saveSyncPin,
  generateRandomPin,
  executeTwoWaySync,
  fetchCloudData,
  saveToCloud,
} from './syncService';
import { mergeProgressStates } from './mergeHelper';
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
    ): Promise<{ success: boolean; message: string }> => {
      if (!isSupabaseConfigured()) {
        setSyncStatus('unconfigured');
        const msg = 'Vui lòng kiểm tra cấu hình Supabase URL & Key.';
        setErrorMessage(msg);
        return { success: false, message: msg };
      }
      if (!navigator.onLine) {
        setSyncStatus('offline');
        const msg = 'Thiết bị đang không có kết nối Internet.';
        setErrorMessage(msg);
        return { success: false, message: msg };
      }
      if (isSyncingRef.current) {
        return { success: true, message: 'Đang trong quá trình đồng bộ...' };
      }

      isSyncingRef.current = true;
      setSyncStatus('syncing');
      setErrorMessage(null);

      try {
        const res = await executeTwoWaySync(currentState, syncPin);
        if (res.success && res.mergedState) {
          setSyncStatus('synced');
          setLastSyncedAt(res.lastSyncedAt || new Date().toISOString());
          if (onStateUpdated) {
            onStateUpdated(res.mergedState);
          }
          return { success: true, message: 'Đã đồng bộ dữ liệu thành công!' };
        } else {
          setSyncStatus('error');
          setErrorMessage(res.message || 'Lỗi đồng bộ');
          return { success: false, message: res.message || 'Lỗi đồng bộ' };
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Lỗi đồng bộ';
        setSyncStatus('error');
        setErrorMessage(msg);
        return { success: false, message: msg };
      } finally {
        isSyncingRef.current = false;
      }
    },
    [syncPin]
  );

  const linkNewPin = useCallback(
    async (
      newPin: string,
      currentState: UserProgressState,
      onStateUpdated?: (merged: UserProgressState) => void
    ): Promise<{ success: boolean; message: string }> => {
      const cleanPin = newPin.trim().toUpperCase();
      if (!cleanPin) {
        return { success: false, message: 'Vui lòng nhập mã PIN hợp lệ!' };
      }
      if (cleanPin === syncPin) {
        return {
          success: false,
          message: `Mã ${cleanPin} là mã PIN của CHÍNH thiết bị này. Hãy mở thiết bị kia và lấy mã PIN ở đó nhập vào đây nhé!`,
        };
      }

      if (!isSupabaseConfigured()) {
        setSyncStatus('unconfigured');
        const msg = 'Chưa cấu hình Supabase URL & Key.';
        setErrorMessage(msg);
        return { success: false, message: msg };
      }

      setSyncStatus('syncing');
      setErrorMessage(null);

      try {
        const cloudData = await fetchCloudData(cleanPin);
        if (!cloudData) {
          setSyncStatus('error');
          const msg = `Không tìm thấy dữ liệu trên Cloud cho mã PIN ${cleanPin}. Hãy mở thiết bị kia và bấm "Đồng bộ ngay" trước!`;
          setErrorMessage(msg);
          return { success: false, message: msg };
        }

        const merged = mergeProgressStates(currentState, cloudData);
        saveSyncPin(cleanPin);
        setSyncPinState(cleanPin);
        await saveToCloud(cleanPin, merged);

        if (onStateUpdated) {
          onStateUpdated(merged);
        }
        setSyncStatus('synced');
        setLastSyncedAt(new Date().toISOString());

        return {
          success: true,
          message: `Đã kết nối thành công với mã PIN ${cleanPin} và cập nhật dữ liệu!`,
        };
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Lỗi kết nối';
        setSyncStatus('error');
        setErrorMessage(msg);
        return { success: false, message: msg };
      } finally {
        isSyncingRef.current = false;
      }
    },
    [syncPin]
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
