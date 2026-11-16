import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_URL_KEY = '100days_push_run_supabase_url';
const STORAGE_KEY_KEY = '100days_push_run_supabase_anon_key';

let cachedClient: SupabaseClient | null = null;
let cachedUrl = '';
let cachedKey = '';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function isSecretKey(key: string): boolean {
  const trimmed = key.trim();
  return trimmed.startsWith('sb_secret_') || trimmed.includes('service_role');
}

export function clearCustomSupabaseConfig(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_URL_KEY);
  localStorage.removeItem(STORAGE_KEY_KEY);
  cachedClient = null;
  cachedUrl = '';
  cachedKey = '';
}

export function normalizeSupabaseUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';

  const dashboardMatch = trimmed.match(/supabase\.com\/dashboard\/project\/([a-zA-Z0-9_-]+)/);
  if (dashboardMatch && dashboardMatch[1]) {
    return `https://${dashboardMatch[1]}.supabase.co`;
  }

  if (/^[a-zA-Z0-9_-]{15,30}$/.test(trimmed)) {
    return `https://${trimmed}.supabase.co`;
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed.replace(/\/+$/, '');
  }

  return trimmed;
}

export function getSupabaseConfig(): SupabaseConfig {
  if (typeof window === 'undefined') {
    return { url: '', anonKey: '' };
  }
  let storedUrl = localStorage.getItem(STORAGE_URL_KEY) || '';
  let storedKey = localStorage.getItem(STORAGE_KEY_KEY) || '';
  const envUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

  // Auto-purge any accidentally saved secret/service_role keys
  if (isSecretKey(storedKey)) {
    localStorage.removeItem(STORAGE_KEY_KEY);
    storedKey = '';
  }

  const rawUrl = storedUrl.trim() || envUrl.trim();
  return {
    url: normalizeSupabaseUrl(rawUrl),
    anonKey: storedKey.trim() || envKey.trim(),
  };
}

export function saveSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window === 'undefined') return;
  if (isSecretKey(anonKey)) {
    throw new Error('Supabase nghiêm cấm dùng Secret Key trong trình duyệt. Vui lòng dùng Publishable Key hoặc Anon Key!');
  }
  const normalized = normalizeSupabaseUrl(url);
  localStorage.setItem(STORAGE_URL_KEY, normalized);
  localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
  cachedClient = null;
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey && url.startsWith('http') && !isSecretKey(anonKey));
}

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey || !url.startsWith('http') || isSecretKey(anonKey)) {
    return null;
  }
  if (cachedClient && cachedUrl === url && cachedKey === anonKey) {
    return cachedClient;
  }
  try {
    cachedClient = createClient(url, anonKey, {
      auth: { persistSession: false },
    });
    cachedUrl = url;
    cachedKey = anonKey;
    return cachedClient;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return null;
  }
}
