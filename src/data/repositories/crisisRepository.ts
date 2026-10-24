import { CrisisContact, FALLBACK_CRISIS_CONTACTS } from '../../content/fallbackCrisisContacts';
import { StorageAdapter } from '../storage/storageAdapter';
import { defaultStorage } from '../storage/localStorageAdapter';

export interface CrisisRepository {
  getContacts(): Promise<CrisisContact[]>;
}

export class MockCrisisRepository implements CrisisRepository {
  private storage: StorageAdapter;

  constructor(storage: StorageAdapter = defaultStorage) {
    this.storage = storage;
  }

  public async getContacts(): Promise<CrisisContact[]> {
    const cached = await this.storage.get<CrisisContact[]>('crisis_contacts');
    if (cached && cached.length > 0) {
      return cached;
    }
    await this.storage.set('crisis_contacts', FALLBACK_CRISIS_CONTACTS);
    return FALLBACK_CRISIS_CONTACTS;
  }
}

export const crisisRepository = new MockCrisisRepository();
