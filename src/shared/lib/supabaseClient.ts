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

export function getSupabaseConfig(): SupabaseConfig {
  if (typeof window === 'undefined') {
    return { url: '', anonKey: '' };
  }
  const storedUrl = localStorage.getItem(STORAGE_URL_KEY) || '';
  const storedKey = localStorage.getItem(STORAGE_KEY_KEY) || '';
  const envUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

  return {
    url: storedUrl.trim() || envUrl.trim(),
    anonKey: storedKey.trim() || envKey.trim(),
  };
}

export function saveSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_URL_KEY, url.trim());
  localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
  cachedClient = null; // Invalidate cached client
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey && url.startsWith('http'));
}

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey || !url.startsWith('http')) {
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
