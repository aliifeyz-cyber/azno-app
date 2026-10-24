import { describe, it, expect } from 'vitest';
import { calculateStreak } from '../src/domain/streakCalculator';
import { HabitLog } from '../src/data/types';

describe('streakCalculator', () => {
  it('calculates streak for build habits with consecutive done days', () => {
    const logs: HabitLog[] = [
      { date: '2025-01-01', dayIndex: 1, status: 'done' },
      { date: '2025-01-02', dayIndex: 2, status: 'done' },
      { date: '2025-01-03', dayIndex: 3, status: 'done' },
    ];
    const result = calculateStreak(logs, 'build');
    expect(result.currentStreak).toBe(3);
    expect(result.bestStreak).toBe(3);
  });

  it('resets current streak on slip for build habit', () => {
    const logs: HabitLog[] = [
      { date: '2025-01-01', dayIndex: 1, status: 'done' },
      { date: '2025-01-02', dayIndex: 2, status: 'done' },
      { date: '2025-01-03', dayIndex: 3, status: 'slipped' },
      { date: '2025-01-04', dayIndex: 4, status: 'done' },
    ];
    const result = calculateStreak(logs, 'build');
    expect(result.currentStreak).toBe(1);
    expect(result.bestStreak).toBe(2);
  });

  it('allows forgiveness day (skipped) without breaking current streak', () => {
    const logs: HabitLog[] = [
      { date: '2025-01-01', dayIndex: 1, status: 'done' },
      { date: '2025-01-02', dayIndex: 2, status: 'skipped' }, // Grace / forgiveness day
      { date: '2025-01-03', dayIndex: 3, status: 'done' },
    ];
    const result = calculateStreak(logs, 'build');
    expect(result.currentStreak).toBe(2);
    expect(result.bestStreak).toBe(2);
  });

  it('calculates streak for quit habits correctly', () => {
    const logs: HabitLog[] = [
      { date: '2025-01-01', dayIndex: 1, status: 'done' }, // Clean
      { date: '2025-01-02', dayIndex: 2, status: 'done' }, // Clean
      { date: '2025-01-03', dayIndex: 3, status: 'done' }, // Clean
    ];
    const result = calculateStreak(logs, 'quit');
    expect(result.currentStreak).toBe(3);
  });
});
