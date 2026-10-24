import { DEFAULT_TEXTS_MAP, TextDef } from '../../content/texts';
import { StorageAdapter } from '../storage/storageAdapter';
import { localStorageAdapter } from '../storage/localStorageAdapter';

export interface ContentRepository {
  getTexts(): Promise<Record<string, string>>;
  getTextDefs(): Promise<TextDef[]>;
  updateText(key: string, value: string): Promise<void>;
  resetText(key: string): Promise<void>;
  resetAllTexts(): Promise<void>;
  exportJson(): Promise<string>;
  importJson(jsonString: string): Promise<{ success: boolean; count: number; error?: string }>;
}

const STORAGE_KEYS = {
  OVERRIDES: 'content:overrides',
};

export class MockContentRepository implements ContentRepository {
  private storage: StorageAdapter;

  constructor(storage: StorageAdapter = localStorageAdapter) {
    this.storage = storage;
  }

  async getTexts(): Promise<Record<string, string>> {
    const overrides = await this.storage.getItem<Record<string, string>>(STORAGE_KEYS.OVERRIDES) || {};
    const result: Record<string, string> = {};

    // Combine default with overrides
    for (const [key, def] of Object.entries(DEFAULT_TEXTS_MAP)) {
      result[key] = overrides[key] !== undefined ? overrides[key] : def.defaultValue;
    }
    return result;
  }

  async getTextDefs(): Promise<TextDef[]> {
    return Object.values(DEFAULT_TEXTS_MAP);
  }

  async updateText(key: string, value: string): Promise<void> {
    const overrides = await this.storage.getItem<Record<string, string>>(STORAGE_KEYS.OVERRIDES) || {};
    overrides[key] = value;
    await this.storage.setItem(STORAGE_KEYS.OVERRIDES, overrides);
  }

  async resetText(key: string): Promise<void> {
    const overrides = await this.storage.getItem<Record<string, string>>(STORAGE_KEYS.OVERRIDES) || {};
    delete overrides[key];
    await this.storage.setItem(STORAGE_KEYS.OVERRIDES, overrides);
  }

  async resetAllTexts(): Promise<void> {
    await this.storage.removeItem(STORAGE_KEYS.OVERRIDES);
  }

  async exportJson(): Promise<string> {
    const overrides = await this.storage.getItem<Record<string, string>>(STORAGE_KEYS.OVERRIDES) || {};
    return JSON.stringify(overrides, null, 2);
  }

  async importJson(jsonString: string): Promise<{ success: boolean; count: number; error?: string }> {
    try {
      const parsed = JSON.parse(jsonString);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        return { success: false, count: 0, error: 'فرمت فایل JSON نامعتبر است.' };
      }
      const overrides: Record<string, string> = {};
      let count = 0;
      for (const [key, val] of Object.entries(parsed)) {
        if (DEFAULT_TEXTS_MAP[key] && typeof val === 'string') {
          overrides[key] = val;
          count++;
        }
      }
      await this.storage.setItem(STORAGE_KEYS.OVERRIDES, overrides);
      return { success: true, count };
    } catch {
      return { success: false, count: 0, error: 'خطا در خواندن فایل JSON.' };
    }
  }
}

export const contentRepository = new MockContentRepository();
