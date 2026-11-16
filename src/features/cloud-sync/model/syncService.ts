import { getSupabaseClient } from '@/shared/lib/supabaseClient';
import { UserProgressState } from '@/entities/user-progress/types';
import { mergeProgressStates } from './mergeHelper';
import { SyncResult } from './syncTypes';

const PIN_STORAGE_KEY = '100days_push_run_sync_pin';
const DEVICE_ID_KEY = '100days_push_run_device_id';

export function getDeviceId(): string {
  if (typeof window === 'undefined') return 'unknown_device';
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = 'dev_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

export function generateRandomPin(): string {
  // Generate a friendly 6-digit numeric PIN, e.g. 883921
  const num = Math.floor(100000 + Math.random() * 900000);
  return String(num);
}

export function getStoredSyncPin(): string {
  if (typeof window === 'undefined') return '';
  let pin = localStorage.getItem(PIN_STORAGE_KEY) || '';
  if (!pin) {
    pin = generateRandomPin();
    localStorage.setItem(PIN_STORAGE_KEY, pin);
  }
  return pin;
}

export function saveSyncPin(pin: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PIN_STORAGE_KEY, pin.trim().toUpperCase());
}

export async function fetchCloudData(pin: string): Promise<UserProgressState | null> {
  const client = getSupabaseClient();
  if (!client || !pin) return null;

  const { data, error } = await client
    .from('athlete_sync')
    .select('data, updated_at')
    .eq('sync_pin', pin.trim())
    .maybeSingle();

  if (error) {
    console.error('Supabase fetch error:', error);
    return null;
  }
  return (data?.data as UserProgressState) || null;
}

export async function saveToCloud(
  pin: string,
  state: UserProgressState
): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client || !pin) return false;

  const deviceId = getDeviceId();
  const payload = {
    sync_pin: pin.trim(),
    data: state,
    updated_at: new Date().toISOString(),
    device_id: deviceId,
  };

  const { error } = await client
    .from('athlete_sync')
    .upsert(payload, { onConflict: 'sync_pin' });

  if (error) {
    console.error('Supabase upsert error:', error);
    return false;
  }
  return true;
}

export async function executeTwoWaySync(
  localState: UserProgressState,
  pin: string
): Promise<SyncResult> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Chưa cấu hình Supabase URL & Anon Key' };
  }
  if (!navigator.onLine) {
    return { success: false, message: 'Thiết bị đang ngoại tuyến' };
  }

  try {
    const remoteState = await fetchCloudData(pin);
    let finalState = localState;

    if (remoteState) {
      finalState = mergeProgressStates(localState, remoteState);
    }

    const saved = await saveToCloud(pin, finalState);
    if (!saved) {
      return { success: false, message: 'Lỗi khi lưu lên Supabase' };
    }

    return {
      success: true,
      mergedState: finalState,
      lastSyncedAt: new Date().toISOString(),
      message: 'Đồng bộ thành công!',
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Two-way sync exception:', err);
    return { success: false, message: msg };
  }
}
