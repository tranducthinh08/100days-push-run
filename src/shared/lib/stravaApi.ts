import { getStorageItem, setStorageItem } from './storage';

export interface StravaCredentials {
  clientId?: string;
  clientSecret?: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface StravaRunActivity {
  id: number;
  name: string;
  distanceKm: number;
  movingTimeSec: number;
  startDate: string;
  averagePaceMinKm: string;
  totalElevationGain: number;
}

const STRAVA_STORAGE_KEY = 'strava_credentials';

export function getStravaCredentials(): StravaCredentials | null {
  return getStorageItem<StravaCredentials | null>(STRAVA_STORAGE_KEY, null);
}

export function saveStravaCredentials(creds: StravaCredentials): void {
  setStorageItem(STRAVA_STORAGE_KEY, creds);
}

export function clearStravaCredentials(): void {
  setStorageItem(STRAVA_STORAGE_KEY, null);
}

export function formatPaceFromSpeed(metersPerSec: number): string {
  if (!metersPerSec || metersPerSec <= 0) return '--:--';
  const secPerKm = 1000 / metersPerSec;
  const minutes = Math.floor(secPerKm / 60);
  const seconds = Math.floor(secPerKm % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds} /km`;
}

export function formatRunDuration(totalSec: number): string {
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  if (mins < 60) {
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  }
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hours}h ${remMins}m`;
}

export async function fetchRecentStravaRuns(accessToken: string): Promise<StravaRunActivity[]> {
  const url = 'https://www.strava.com/api/v3/athlete/activities?per_page=15';
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Lỗi kết nối Strava API: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as Array<{
    id: number;
    name: string;
    type: string;
    sport_type?: string;
    distance: number;
    moving_time: number;
    start_date: string;
    average_speed: number;
    total_elevation_gain: number;
  }>;

  return data
    .filter((act) => act.type === 'Run' || act.sport_type === 'Run')
    .map((act) => ({
      id: act.id,
      name: act.name,
      distanceKm: +(act.distance / 1000).toFixed(2),
      movingTimeSec: act.moving_time,
      startDate: act.start_date,
      averagePaceMinKm: formatPaceFromSpeed(act.average_speed),
      totalElevationGain: Math.round(act.total_elevation_gain || 0),
    }));
}
