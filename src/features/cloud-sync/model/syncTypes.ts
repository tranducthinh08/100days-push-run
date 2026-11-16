import { UserProgressState } from '@/entities/user-progress/types';

export type SyncStatus =
  | 'idle'
  | 'syncing'
  | 'synced'
  | 'error'
  | 'offline'
  | 'unconfigured';

export interface CloudRecord {
  sync_pin: string;
  data: UserProgressState;
  updated_at: string;
  device_id?: string;
}

export interface SyncResult {
  success: boolean;
  message?: string;
  mergedState?: UserProgressState;
  lastSyncedAt?: string;
}
