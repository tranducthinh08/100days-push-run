/**
 * Offline-first typed storage utility with JSON export/import
 */

const STORAGE_PREFIX = '100days_push_run_';

export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Error reading key "${key}" from localStorage:`, error);
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving key "${key}" to localStorage:`, error);
  }
}

export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key);
  } catch (error) {
    console.error(`Error removing key "${key}" from localStorage:`, error);
  }
}

export function exportAllData(): string {
  const exportObj: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_PREFIX)) {
      const cleanKey = key.slice(STORAGE_PREFIX.length);
      try {
        exportObj[cleanKey] = JSON.parse(localStorage.getItem(key) || 'null');
      } catch {
        exportObj[cleanKey] = localStorage.getItem(key);
      }
    }
  }
  return JSON.stringify(exportObj, null, 2);
}

export function importAllData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString) as Record<string, unknown>;
    for (const [key, value] of Object.entries(data)) {
      setStorageItem(key, value);
    }
    return true;
  } catch (error) {
    console.error('Failed to import data:', error);
    return false;
  }
}
