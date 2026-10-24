import { describe, it, expect } from 'vitest';
import { calculateNextEscalationStep, ESCALATION_STEPS } from '../src/domain/reminderEscalation';

describe('reminderEscalation', () => {
  it('does NOT escalate quit habits', () => {
    const res = calculateNextEscalationStep({
      currentStep: 1,
      habitType: 'quit',
      totalRemindersTodayForHabit: 1,
      totalRemindersTodayAllHabits: 2,
    });
    expect(res.canEscalate).toBe(false);
  });

  it('progresses through steps 1 to 4 for build habits within limits', () => {
    const res = calculateNextEscalationStep({
      currentStep: 1,
      habitType: 'build',
      totalRemindersTodayForHabit: 1,
      totalRemindersTodayAllHabits: 2,
    });
    expect(res.canEscalate).toBe(true);
    expect(res.nextStep).toBe(2);
    expect(res.stepInfo?.intensity).toBe('reminder');
  });

  it('stops escalating when habit cap (4) is reached', () => {
    const res = calculateNextEscalationStep({
      currentStep: 3,
      habitType: 'build',
      totalRemindersTodayForHabit: 4, // Max per habit reached
      totalRemindersTodayAllHabits: 5,
    });
    expect(res.canEscalate).toBe(false);
  });

  it('stops escalating when daily global cap (6) across all habits is reached', () => {
    const res = calculateNextEscalationStep({
      currentStep: 1,
      habitType: 'build',
      totalRemindersTodayForHabit: 2,
      totalRemindersTodayAllHabits: 6, // Global cap reached
    });
    expect(res.canEscalate).toBe(false);
  });
});
