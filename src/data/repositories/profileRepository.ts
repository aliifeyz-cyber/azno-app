import { UserProfile } from '../types';
import { StorageAdapter } from '../storage/storageAdapter';
import { defaultStorage } from '../storage/localStorageAdapter';

export const DEFAULT_PROFILE: UserProfile = {
  id: 'user-me',
  displayName: 'همسفر صبور',
  email: 'ali@azno.ir',
  plan: 'free',
  heroName: 'ازمن',
  heroStyle: 'friendly',
  onboardingCompleted: true,
  masterRemindersEnabled: true,
  themeMode: 'light',
  createdAt: new Date().toISOString(),
};

export interface ProfileRepository {
  getProfile(): Promise<UserProfile>;
  updateProfile(patch: Partial<UserProfile>): Promise<UserProfile>;
  resetProfile(): Promise<UserProfile>;
}

export class MockProfileRepository implements ProfileRepository {
  private storage: StorageAdapter;

  constructor(storage: StorageAdapter = defaultStorage) {
    this.storage = storage;
  }

  public async getProfile(): Promise<UserProfile> {
    const cached = await this.storage.get<UserProfile>('profile');
    if (cached) {
      return cached;
    }
    await this.storage.set('profile', DEFAULT_PROFILE);
    return DEFAULT_PROFILE;
  }

  public async updateProfile(patch: Partial<UserProfile>): Promise<UserProfile> {
    const current = await this.getProfile();
    const updated: UserProfile = { ...current, ...patch };
    await this.storage.set('profile', updated);
    return updated;
  }

  public async resetProfile(): Promise<UserProfile> {
    await this.storage.set('profile', DEFAULT_PROFILE);
    return DEFAULT_PROFILE;
  }
}

export const profileRepository = new MockProfileRepository();
