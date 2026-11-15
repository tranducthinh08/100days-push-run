import { useState, useEffect, useCallback } from 'react';
import {
  StravaRunActivity,
  getStravaCredentials,
  saveStravaCredentials,
  clearStravaCredentials,
  fetchRecentStravaRuns,
} from '@/shared/lib/stravaApi';

export function useStravaSync() {
  const [credentials, setCredentials] = useState(getStravaCredentials());
  const [activities, setActivities] = useState<StravaRunActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const runs = await fetchRecentStravaRuns(token);
      setActivities(runs);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Không thể tải dữ liệu từ Strava';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (credentials?.accessToken) {
      fetchActivities(credentials.accessToken);
    }
  }, [credentials, fetchActivities]);

  const connectWithToken = (token: string, clientId?: string) => {
    const creds = { accessToken: token.trim(), clientId: clientId?.trim() };
    saveStravaCredentials(creds);
    setCredentials(creds);
    fetchActivities(creds.accessToken);
  };

  const disconnect = () => {
    clearStravaCredentials();
    setCredentials(null);
    setActivities([]);
    setError(null);
  };

  const refresh = () => {
    if (credentials?.accessToken) {
      fetchActivities(credentials.accessToken);
    }
  };

  return {
    isConnected: !!credentials?.accessToken,
    credentials,
    activities,
    isLoading,
    error,
    connectWithToken,
    disconnect,
    refresh,
  };
}
