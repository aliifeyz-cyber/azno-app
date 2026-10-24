import { describe, it, expect } from 'vitest';
import { countDoneDaysInCurrentStep } from '../src/domain/stepProgress';
import { HabitLog } from '../src/data/types';

describe('stepProgress', () => {
  it('counts done days strictly from current step startDate onwards', () => {
    const logs: HabitLog[] = [
      { date: '2025-01-01', dayIndex: 1, status: 'done' }, // Before step started
      { date: '2025-01-02', dayIndex: 2, status: 'done' }, // Before step started
      { date: '2025-01-03', dayIndex: 3, status: 'done' }, // Step start day!
      { date: '2025-01-04', dayIndex: 4, status: 'done' }, // Step day 2
      { date: '2025-01-05', dayIndex: 5, status: 'slipped' }, // Slipped, not counted
      { date: '2025-01-06', dayIndex: 6, status: 'done' }, // Step day 3
    ];

    const count = countDoneDaysInCurrentStep('2025-01-03', logs);
    expect(count).toBe(3);
  });

  it('returns 0 if no done logs exist after or on startDate', () => {
    const logs: HabitLog[] = [
      { date: '2025-01-01', dayIndex: 1, status: 'done' },
      { date: '2025-01-02', dayIndex: 2, status: 'slipped' },
    ];
    const count = countDoneDaysInCurrentStep('2025-01-05', logs);
    expect(count).toBe(0);
  });
});
