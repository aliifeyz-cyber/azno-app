export interface NotificationService {
  requestPermission(): Promise<boolean>;
  scheduleReminder(habitId: string, title: string, time: string, step: number): Promise<void>;
  cancelReminder(habitId: string): Promise<void>;
  getScheduled(): Promise<Array<{ habitId: string; title: string; time: string; step: number }>>;
}

class MockNotificationService implements NotificationService {
  private scheduled: Array<{ habitId: string; title: string; time: string; step: number }> = [];

  async requestPermission(): Promise<boolean> {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const res = await Notification.requestPermission();
        return res === 'granted';
      } catch {
        return false;
      }
    }
    return false;
  }

  async scheduleReminder(habitId: string, title: string, time: string, step: number): Promise<void> {
    this.scheduled = this.scheduled.filter((s) => s.habitId !== habitId);
    this.scheduled.push({ habitId, title, time, step });
  }

  async cancelReminder(habitId: string): Promise<void> {
    this.scheduled = this.scheduled.filter((s) => s.habitId !== habitId);
  }

  async getScheduled(): Promise<Array<{ habitId: string; title: string; time: string; step: number }>> {
    return [...this.scheduled];
  }
}

export const notificationService: NotificationService = new MockNotificationService();
