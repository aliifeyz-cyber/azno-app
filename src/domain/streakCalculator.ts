import { HabitActionStatus } from '../data/types';

export type HabitLogStatus = HabitActionStatus;

export interface DayLog {
  date: string; // YYYY-MM-DD
  status: HabitActionStatus;
}

export interface StreakResult {
  currentStreak: number;
  bestStreak: number;
}

/**
 * محاسبه استمرارهای متوالی با قانون روز بخشش (Grace Day)
 * - روز انجام‌شده (done): استریک ۱ واحد افزایش می‌یابد.
 * - روز ردشده با مکث آگاهانه (skipped): استریک حفظ می‌شود ولی افزایش نمی‌یابد (زنجیره قطع نمی‌شود).
 * - روز لغزش (slipped): استریک صفر می‌شود.
 */
export function calculateStreak(
  logs: DayLog[],
  typeOrDate?: 'build' | 'quit' | string,
  referenceDateStr?: string
): StreakResult {
  if (!logs || logs.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  // Determine reference date (defaults to latest log date)
  let refDate = referenceDateStr;
  if (!refDate && typeOrDate && typeOrDate.includes('-')) {
    refDate = typeOrDate;
  }
  if (!refDate) {
    // Pick the most recent log's date
    const dates = logs.map((l) => l.date).sort();
    refDate = dates[dates.length - 1];
  }

  // Sort logs chronologically ascending
  const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date));

  // Map for fast lookup
  const map = new Map<string, HabitLogStatus>();
  for (const l of sorted) {
    map.set(l.date, l.status);
  }

  // Calculate Best Streak across full history
  let maxStreak = 0;
  let runningStreak = 0;
  let runningGrace = 0;

  for (const log of sorted) {
    if (log.status === 'done') {
      runningStreak++;
      runningGrace = 0;
      if (runningStreak > maxStreak) {
        maxStreak = runningStreak;
      }
    } else if (log.status === 'skipped') {
      runningGrace++;
      if (runningGrace > 2) {
        runningStreak = 0;
      }
    } else if (log.status === 'slipped') {
      runningStreak = 0;
      runningGrace = 0;
    }
  }

  // Calculate Current Streak backwards from reference date
  let currentStreak = 0;
  let checkDate = new Date(refDate);
  if (isNaN(checkDate.getTime())) {
    checkDate = new Date();
  }

  let consecutiveGrace = 0;

  // Check if today/refDate is slipped
  const refStatus = map.get(refDate);
  if (refStatus === 'slipped') {
    return { currentStreak: 0, bestStreak: maxStreak };
  }

  while (true) {
    const dateStr = checkDate.toISOString().slice(0, 10);
    const status = map.get(dateStr);

    if (status === 'done') {
      currentStreak++;
      consecutiveGrace = 0;
    } else if (status === 'skipped') {
      consecutiveGrace++;
      if (consecutiveGrace > 2) {
        break;
      }
    } else if (status === 'slipped') {
      break;
    } else {
      // If we are at refDate and today hasn't been logged yet, check yesterday
      if (dateStr === refDate && currentStreak === 0) {
        // Continue to check yesterday
      } else {
        break;
      }
    }

    checkDate.setDate(checkDate.getDate() - 1);
  }

  return {
    currentStreak,
    bestStreak: Math.max(maxStreak, currentStreak),
  };
}
