export interface EscalationStepInfo {
  step: number;
  label: string;
  intensity: 'soft' | 'reminder' | 'encouraging' | 'urgent';
  tone: string;
}

export const ESCALATION_STEPS: Record<number, EscalationStepInfo> = {
  1: { step: 1, label: 'یادآوری ملایم اول', intensity: 'soft', tone: 'یک تلنگر دوستانه' },
  2: { step: 2, label: 'یادآوری دوم', intensity: 'reminder', tone: 'تاکید بر هدف و ریزگام' },
  3: { step: 3, label: 'یادآوری سوم تشویقی', intensity: 'encouraging', tone: 'یادآوری استریک و دستاوردها' },
  4: { step: 4, label: 'یادآوری پایانی', intensity: 'urgent', tone: 'دعوت به انجام حتی یک دقیقه قبل از پایان روز' },
};

export interface CalculateEscalationParams {
  currentStep: number;
  habitType: 'build' | 'quit';
  totalRemindersTodayForHabit: number;
  totalRemindersTodayAllHabits: number;
}

export interface EscalationResult {
  canEscalate: boolean;
  nextStep?: number;
  stepInfo?: EscalationStepInfo;
  reason?: string;
}

export function calculateNextEscalationStep(params: CalculateEscalationParams): EscalationResult {
  const { currentStep, habitType, totalRemindersTodayForHabit, totalRemindersTodayAllHabits } = params;

  // 1. Quit habits never escalate!
  if (habitType === 'quit') {
    return {
      canEscalate: false,
      reason: 'عادات ترک تشدید زمان‌دار ندارند.',
    };
  }

  // 2. Global cap of 6 across all habits
  if (totalRemindersTodayAllHabits >= 6) {
    return {
      canEscalate: false,
      reason: 'سقف کل یادآورهای روزانه اپلیکیشن (۶ عدد) تکمیل شده است.',
    };
  }

  // 3. Habit cap of 4
  if (totalRemindersTodayForHabit >= 4 || currentStep >= 4) {
    return {
      canEscalate: false,
      reason: 'سقف یادآورهای این عادت (۴ عدد) تکمیل شده است.',
    };
  }

  const nextStep = currentStep + 1;
  return {
    canEscalate: true,
    nextStep,
    stepInfo: ESCALATION_STEPS[nextStep],
  };
}

export class ReminderEscalationManager {
  private habitNotificationCount: Map<string, number> = new Map();
  private totalDailyCount = 0;
  private currentDateStr = '';

  constructor(currentDateStr = new Date().toISOString().slice(0, 10)) {
    this.currentDateStr = currentDateStr;
  }

  public checkDateRollover(todayDateStr: string): void {
    if (this.currentDateStr !== todayDateStr) {
      this.habitNotificationCount.clear();
      this.totalDailyCount = 0;
      this.currentDateStr = todayDateStr;
    }
  }

  public canScheduleNext(habit: { id: string; type: 'build' | 'quit'; isCompletedToday: boolean }, todayDateStr: string) {
    this.checkDateRollover(todayDateStr);
    if (habit.isCompletedToday) {
      return { canSchedule: false, reason: 'عادت امروز انجام شده است.' };
    }
    const currentCount = this.habitNotificationCount.get(habit.id) ?? 0;
    const res = calculateNextEscalationStep({
      currentStep: currentCount,
      habitType: habit.type,
      totalRemindersTodayForHabit: currentCount,
      totalRemindersTodayAllHabits: this.totalDailyCount,
    });
    return { canSchedule: res.canEscalate, nextStep: res.nextStep, reason: res.reason };
  }
}
