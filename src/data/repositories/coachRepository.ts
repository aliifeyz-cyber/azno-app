import { CoachMessage } from '../types';
import { StorageAdapter } from '../storage/storageAdapter';
import { localStorageAdapter } from '../storage/localStorageAdapter';

export interface CoachRepository {
  getMessages(): Promise<CoachMessage[]>;
  saveMessages(messages: CoachMessage[]): Promise<void>;
  addMessage(message: CoachMessage): Promise<void>;
  clearMessages(): Promise<void>;
  getDailyQuota(): Promise<{ remaining: number; max: number; resetDate: string }>;
  decrementQuota(): Promise<number>;
  resetQuota(): Promise<void>;
}

const STORAGE_KEYS = {
  MESSAGES: 'coach:messages',
  QUOTA: 'coach:quota',
};

const INITIAL_MESSAGES: CoachMessage[] = [
  {
    id: 'm1',
    sender: 'ai',
    text: 'سلام رفیق! من «ازمن» هستم. امروز حالت چطوره؟ برای چه تغییری کنارتم؟',
    time: '۱۰:۰۰',
  },
];

export class MockCoachRepository implements CoachRepository {
  private storage: StorageAdapter;
  private maxDailyQuota = 5;

  constructor(storage: StorageAdapter = localStorageAdapter) {
    this.storage = storage;
  }

  async getMessages(): Promise<CoachMessage[]> {
    const saved = await this.storage.getItem<CoachMessage[]>(STORAGE_KEYS.MESSAGES);
    if (!saved || saved.length === 0) {
      await this.storage.setItem(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
      return INITIAL_MESSAGES;
    }
    return saved;
  }

  async saveMessages(messages: CoachMessage[]): Promise<void> {
    await this.storage.setItem(STORAGE_KEYS.MESSAGES, messages);
  }

  async addMessage(message: CoachMessage): Promise<void> {
    const list = await this.getMessages();
    list.push(message);
    await this.saveMessages(list);
  }

  async clearMessages(): Promise<void> {
    await this.storage.setItem(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
  }

  async getDailyQuota(): Promise<{ remaining: number; max: number; resetDate: string }> {
    const today = new Date().toISOString().split('T')[0];
    const data = await this.storage.getItem<{ remaining: number; max: number; resetDate: string }>(STORAGE_KEYS.QUOTA);
    if (!data || data.resetDate !== today) {
      const fresh = { remaining: this.maxDailyQuota, max: this.maxDailyQuota, resetDate: today };
      await this.storage.setItem(STORAGE_KEYS.QUOTA, fresh);
      return fresh;
    }
    return data;
  }

  async decrementQuota(): Promise<number> {
    const quota = await this.getDailyQuota();
    if (quota.remaining > 0) {
      quota.remaining -= 1;
      await this.storage.setItem(STORAGE_KEYS.QUOTA, quota);
    }
    return quota.remaining;
  }

  async resetQuota(): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    await this.storage.setItem(STORAGE_KEYS.QUOTA, {
      remaining: this.maxDailyQuota,
      max: this.maxDailyQuota,
      resetDate: today,
    });
  }
}

export const coachRepository = new MockCoachRepository();
