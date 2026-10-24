import { HabitLog } from '../data/types';

export interface HabitStepInfo {
  id: string;
  title: string;
  targetDays: number;
  startDate: string; // YYYY-MM-DD
  status: 'pending' | 'active' | 'done';
}

export interface StepProgressResult {
  stepId: string;
  successfulDays: number;
  targetDays: number;
  progressPercentage: number;
  isReadyForNextStep: boolean;
}

export function countDoneDaysInCurrentStep(startDate: string, logs: HabitLog[]): number {
  if (!logs || logs.length === 0) return 0;
  return logs.filter((log) => log.date >= startDate && log.status === 'done').length;
}

export function calculateStepProgress(
  step: HabitStepInfo,
  logs: HabitLog[]
): StepProgressResult {
  if (!logs || logs.length === 0) {
    return {
      stepId: step.id,
      successfulDays: 0,
      targetDays: step.targetDays,
      progressPercentage: 0,
      isReadyForNextStep: false,
    };
  }

  const successfulDays = countDoneDaysInCurrentStep(step.startDate, logs);
  const targetDays = Math.max(1, step.targetDays);
  const progressPercentage = Math.min(100, Math.round((successfulDays / targetDays) * 100));
  const isReadyForNextStep = successfulDays >= targetDays;

  return {
    stepId: step.id,
    successfulDays,
    targetDays,
    progressPercentage,
    isReadyForNextStep,
  };
}
