import { StorageAdapter } from './storageAdapter';

const SCHEMA_VERSION = 'v1';
const PREFIX = 'azno';

/**
 * پیاده‌سازی ذخیره‌سازی محلی با پیشوند و نسخه ساختار
 */
export class LocalStorageAdapter implements StorageAdapter {
  private formatKey(key: string): string {
    return `${PREFIX}:${SCHEMA_VERSION}:${key}`;
  }

  public async get<T>(key: string): Promise<T | null> {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return null;
      }
      const raw = window.localStorage.getItem(this.formatKey(key));
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch (e) {
      console.warn(`[LocalStorageAdapter] Failed to get ${key}:`, e);
      return null;
    }
  }

  public async set<T>(key: string, value: T): Promise<void> {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      window.localStorage.setItem(this.formatKey(key), JSON.stringify(value));
    } catch (e) {
      console.warn(`[LocalStorageAdapter] Failed to set ${key}:`, e);
    }
  }

  public async remove(key: string): Promise<void> {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      window.localStorage.removeItem(this.formatKey(key));
    } catch (e) {
      console.warn(`[LocalStorageAdapter] Failed to remove ${key}:`, e);
    }
  }

  public async clear(): Promise<void> {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && k.startsWith(`${PREFIX}:`)) {
          keysToRemove.push(k);
        }
      }
      for (const k of keysToRemove) {
        window.localStorage.removeItem(k);
      }
    } catch (e) {
      console.warn('[LocalStorageAdapter] Failed to clear:', e);
    }
  }

  public getItem<T>(key: string): Promise<T | null> {
    return this.get<T>(key);
  }

  public setItem<T>(key: string, value: T): Promise<void> {
    return this.set<T>(key, value);
  }

  public removeItem(key: string): Promise<void> {
    return this.remove(key);
  }
}

export const defaultStorage = new LocalStorageAdapter();
export const localStorageAdapter = defaultStorage;
