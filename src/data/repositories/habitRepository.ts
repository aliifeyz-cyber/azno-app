import { Habit, HabitActionStatus, HabitLog } from '../types';
import { StorageAdapter } from '../storage/storageAdapter';
import { defaultStorage } from '../storage/localStorageAdapter';

export function generateMockLogs(currentStreak: number, habitType: 'build' | 'quit'): HabitLog[] {
  const logs: HabitLog[] = [];
  const today = new Date();

  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);

    if (i < currentStreak) {
      logs.push({ date: dateStr, dayIndex: 89 - i, status: 'done', mood: 4 });
    } else {
      const rand = (i * 17 + (habitType === 'build' ? 3 : 7)) % 10;
      if (rand > 4) {
        logs.push({ date: dateStr, dayIndex: 89 - i, status: 'done' });
      } else if (rand > 2) {
        logs.push({ date: dateStr, dayIndex: 89 - i, status: 'skipped' });
      } else if (habitType === 'quit' && rand === 1) {
        logs.push({ date: dateStr, dayIndex: 89 - i, status: 'slipped', note: 'در مهمانی وسوسه شدم' });
      }
    }
  }
  return logs;
}

export const DEFAULT_HABITS: Habit[] = [
  {
    id: 'habit-1',
    title: 'پیاده‌روی روزانه',
    category: 'ورزش',
    type: 'build',
    currentStreak: 12,
    bestStreak: 24,
    currentStepTitle: '۱۵ دقیقه پیاده‌روی سبک بعد از کار',
    currentStepIndex: 2,
    targetDays: 7,
    doneDaysInStep: 4,
    reminderTime: '18:30',
    showNameInReminder: false,
    escalationEnabled: true,
    statusToday: 'done',
    trigger: 'بلافاصله بعد از تعطیلی کار',
    microStep: 'فقط پوشیدن کفش و خروج از خانه',
    logs: generateMockLogs(12, 'build'),
    steps: [
      { id: 's1', title: '۲ دقیقه پیاده‌روی سبک', targetDays: 3, startDate: '2026-10-01', status: 'done' },
      { id: 's2', title: '۵ دقیقه پیاده‌روی', targetDays: 5, startDate: '2026-10-05', status: 'done' },
      { id: 's3', title: '۱۵ دقیقه پیاده‌روی سبک بعد از کار', targetDays: 7, startDate: '2026-10-15', status: 'active' },
      { id: 's4', title: '۳۰ دقیقه پیاده‌روی روزانه', targetDays: 14, startDate: '2026-10-25', status: 'pending' },
    ],
  },
  {
    id: 'habit-2',
    title: 'مطالعه کتاب',
    category: 'رشد فردی',
    type: 'build',
    currentStreak: 5,
    bestStreak: 14,
    currentStepTitle: 'خواندن ۵ صفحه کتاب قبل از خواب',
    currentStepIndex: 1,
    targetDays: 5,
    doneDaysInStep: 2,
    reminderTime: '22:00',
    showNameInReminder: true,
    escalationEnabled: true,
    statusToday: 'none',
    trigger: 'بعد از مسواک شبانه',
    microStep: 'فقط باز کردن کتاب و خواندن ۲ خط',
    logs: generateMockLogs(5, 'build'),
    steps: [
      { id: 's2-1', title: 'فقط باز کردن کتاب و ۲ خط خواندن', targetDays: 3, startDate: '2026-10-10', status: 'done' },
      { id: 's2-2', title: 'خواندن ۵ صفحه کتاب قبل از خواب', targetDays: 5, startDate: '2026-10-18', status: 'active' },
      { id: 's2-3', title: 'خواندن ۱۰ صفحه در روز', targetDays: 7, startDate: '2026-10-25', status: 'pending' },
    ],
  },
  {
    id: 'habit-3',
    title: 'کاهش مصرف شکر و شیرینی',
    category: 'تغذیه سالم',
    type: 'quit',
    currentStreak: 9,
    bestStreak: 19,
    currentStepTitle: 'ننوشیدن چای با قند در بعدازظهر',
    currentStepIndex: 1,
    targetDays: 7,
    doneDaysInStep: 5,
    reminderTime: '16:00',
    showNameInReminder: false,
    escalationEnabled: false,
    statusToday: 'none',
    trigger: 'هنگام نوشیدن چای عصرانه',
    microStep: 'نوشیدن یک لیوان آب خنک قبل از تصمیم',
    logs: generateMockLogs(9, 'quit'),
    steps: [
      { id: 's3-1', title: 'حذف شیرینی با چای صبح', targetDays: 5, startDate: '2026-10-08', status: 'done' },
      { id: 's3-2', title: 'ننوشیدن چای با قند در بعدازظهر', targetDays: 7, startDate: '2026-10-15', status: 'active' },
      { id: 's3-3', title: 'عدم مصرف نوشیدنی گازدار شیرین', targetDays: 14, startDate: '2026-10-25', status: 'pending' },
    ],
  },
];

export interface HabitRepository {
  getHabits(): Promise<Habit[]>;
  getHabitById(id: string): Promise<Habit | null>;
  saveHabit(habit: Habit): Promise<Habit>;
  updateAction(id: string, action: HabitActionStatus, todayDateStr: string): Promise<Habit>;
  deleteHabit(id: string): Promise<void>;
  resetHabits(): Promise<Habit[]>;
}

export class MockHabitRepository implements HabitRepository {
  private storage: StorageAdapter;

  constructor(storage: StorageAdapter = defaultStorage) {
    this.storage = storage;
  }

  public async getHabits(): Promise<Habit[]> {
    const cached = await this.storage.get<Habit[]>('habits');
    if (cached) {
      return cached;
    }
    await this.storage.set('habits', DEFAULT_HABITS);
    return DEFAULT_HABITS;
  }

  public async getHabitById(id: string): Promise<Habit | null> {
    const habits = await this.getHabits();
    return habits.find((h) => h.id === id) || null;
  }

  public async createHabit(data: Omit<Habit, 'id' | 'currentStreak' | 'bestStreak' | 'logs' | 'statusToday' | 'doneDaysInStep'>): Promise<Habit> {
    const newHabit: Habit = {
      ...data,
      id: 'habit_' + Date.now(),
      currentStreak: 0,
      bestStreak: 0,
      doneDaysInStep: 0,
      statusToday: 'none',
      logs: [],
    };
    return this.saveHabit(newHabit);
  }

  public async saveHabit(habit: Habit): Promise<Habit> {
    const habits = await this.getHabits();
    const index = habits.findIndex((h) => h.id === habit.id);
    let updated: Habit[];
    if (index >= 0) {
      updated = [...habits];
      updated[index] = habit;
    } else {
      updated = [habit, ...habits];
    }
    await this.storage.set('habits', updated);
    return habit;
  }

  public async updateAction(id: string, action: HabitActionStatus, todayDateStr: string): Promise<Habit> {
    const habits = await this.getHabits();
    const habit = habits.find((h) => h.id === id);
    if (!habit) throw new Error('عادت موردنظر یافت نشد.');

    const prevAction = habit.statusToday;
    const isNowDone = action === 'done';
    const wasDone = prevAction === 'done';

    let newStreak = habit.currentStreak;
    if (isNowDone && !wasDone) {
      newStreak++;
    } else if (!isNowDone && wasDone && newStreak > 0) {
      newStreak--;
    } else if (action === 'slipped') {
      newStreak = 0;
    }

    const newBestStreak = Math.max(habit.bestStreak, newStreak);
    let newDoneDays = habit.doneDaysInStep;
    if (isNowDone && !wasDone) {
      newDoneDays++;
    } else if (!isNowDone && wasDone && newDoneDays > 0) {
      newDoneDays--;
    }

    // به‌روزرسانی لاگ روز
    const updatedLogs = [...habit.logs];
    const logIndex = updatedLogs.findIndex((l) => l.date === todayDateStr);
    if (logIndex >= 0) {
      updatedLogs[logIndex] = { ...updatedLogs[logIndex], status: action };
    } else {
      updatedLogs.unshift({
        date: todayDateStr,
        dayIndex: updatedLogs.length,
        status: action,
      });
    }

    const updatedHabit: Habit = {
      ...habit,
      statusToday: action,
      currentStreak: newStreak,
      bestStreak: newBestStreak,
      doneDaysInStep: newDoneDays,
      logs: updatedLogs,
    };

    await this.saveHabit(updatedHabit);
    return updatedHabit;
  }

  public async deleteHabit(id: string): Promise<void> {
    const habits = await this.getHabits();
    const filtered = habits.filter((h) => h.id !== id);
    await this.storage.set('habits', filtered);
  }

  public async resetHabits(): Promise<Habit[]> {
    await this.storage.set('habits', DEFAULT_HABITS);
    return DEFAULT_HABITS;
  }
}

export const habitRepository = new MockHabitRepository();

