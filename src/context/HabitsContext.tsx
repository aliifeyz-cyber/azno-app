import React, { createContext, useContext, useState, useEffect } from 'react';
import { Habit, HabitActionStatus, HabitLog } from '../data/types';
import { habitRepository } from '../data/repositories/habitRepository';
import { calculateStreak } from '../domain/streakCalculator';
import { countDoneDaysInCurrentStep } from '../domain/stepProgress';

interface HabitsContextType {
  habits: Habit[];
  loading: boolean;
  todayMood: number | null;
  setTodayMood: (mood: number) => void;
  checkInHabit: (habitId: string, status: HabitActionStatus, mood?: number, note?: string) => Promise<void>;
  slipHabit: (habitId: string, reason: string, note?: string) => Promise<void>;
  undoHabit: (habitId: string) => Promise<void>;
  createHabit: (data: Omit<Habit, 'id' | 'currentStreak' | 'bestStreak' | 'logs' | 'statusToday' | 'doneDaysInStep'>) => Promise<Habit>;
  updateHabit: (habit: Habit) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  lastUndoable: { habitId: string; previousStatus: HabitActionStatus; habitTitle: string } | null;
  clearUndoable: () => void;
}

const HabitsContext = createContext<HabitsContextType | null>(null);

export const HabitsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayMood, setTodayMoodState] = useState<number | null>(null);
  const [lastUndoable, setLastUndoable] = useState<{
    habitId: string;
    previousStatus: HabitActionStatus;
    habitTitle: string;
  } | null>(null);

  const loadHabits = async () => {
    try {
      const list = await habitRepository.getHabits();
      setHabits(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const setTodayMood = (mood: number) => {
    setTodayMoodState(mood);
  };

  const checkInHabit = async (habitId: string, status: HabitActionStatus, mood?: number, note?: string) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const previousStatus = habit.statusToday;
    const today = new Date().toISOString().split('T')[0];

    // Build new log entry
    const existingLogIdx = habit.logs.findIndex((l) => l.date === today);
    const updatedLogs: HabitLog[] = [...habit.logs];

    const effectiveMood = mood || todayMood || undefined;

    if (existingLogIdx >= 0) {
      updatedLogs[existingLogIdx] = {
        ...updatedLogs[existingLogIdx],
        status,
        mood: effectiveMood,
        note: note ?? updatedLogs[existingLogIdx].note,
      };
    } else {
      updatedLogs.push({
        date: today,
        dayIndex: updatedLogs.length + 1,
        status,
        mood: effectiveMood,
        note,
      });
    }

    const { currentStreak, bestStreak } = calculateStreak(updatedLogs, habit.type);

    // Calculate step progress if habit has steps
    let doneDaysInStep = habit.doneDaysInStep;
    if (habit.steps && habit.steps.length > 0) {
      const currentStep = habit.steps[habit.currentStepIndex] || habit.steps[0];
      if (currentStep) {
        doneDaysInStep = countDoneDaysInCurrentStep(currentStep.startDate, updatedLogs);
      }
    } else if (status === 'done' && previousStatus !== 'done') {
      doneDaysInStep += 1;
    }

    const updatedHabit: Habit = {
      ...habit,
      statusToday: status,
      currentStreak,
      bestStreak: Math.max(bestStreak, habit.bestStreak),
      doneDaysInStep,
      logs: updatedLogs,
    };

    await habitRepository.saveHabit(updatedHabit);
    setHabits((prev) => prev.map((h) => (h.id === habitId ? updatedHabit : h)));

    // Set undoable state
    setLastUndoable({
      habitId,
      previousStatus,
      habitTitle: habit.title,
    });
  };

  const slipHabit = async (habitId: string, reason: string, note?: string) => {
    const fullNote = reason ? `دلیل لغزش: ${reason}${note ? ` | ${note}` : ''}` : note;
    await checkInHabit(habitId, 'slipped', undefined, fullNote);
  };

  const undoHabit = async (habitId: string) => {
    if (!lastUndoable || lastUndoable.habitId !== habitId) return;

    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const today = new Date().toISOString().split('T')[0];
    const updatedLogs = habit.logs.filter((l) => l.date !== today);
    const { currentStreak, bestStreak } = calculateStreak(updatedLogs, habit.type);

    const revertedHabit: Habit = {
      ...habit,
      statusToday: lastUndoable.previousStatus,
      currentStreak,
      bestStreak,
      logs: updatedLogs,
      doneDaysInStep: Math.max(0, habit.doneDaysInStep - (habit.statusToday === 'done' ? 1 : 0)),
    };

    await habitRepository.saveHabit(revertedHabit);
    setHabits((prev) => prev.map((h) => (h.id === habitId ? revertedHabit : h)));
    setLastUndoable(null);
  };

  const createHabit = async (data: Omit<Habit, 'id' | 'currentStreak' | 'bestStreak' | 'logs' | 'statusToday' | 'doneDaysInStep'>): Promise<Habit> => {
    const newHabit = await habitRepository.createHabit(data);
    setHabits((prev) => [...prev, newHabit]);
    return newHabit;
  };

  const updateHabit = async (habit: Habit) => {
    await habitRepository.saveHabit(habit);
    setHabits((prev) => prev.map((h) => (h.id === habit.id ? habit : h)));
  };

  const deleteHabit = async (habitId: string) => {
    await habitRepository.deleteHabit(habitId);
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  };

  const clearUndoable = () => setLastUndoable(null);

  return (
    <HabitsContext.Provider
      value={{
        habits,
        loading,
        todayMood,
        setTodayMood,
        checkInHabit,
        slipHabit,
        undoHabit,
        createHabit,
        updateHabit,
        deleteHabit,
        lastUndoable,
        clearUndoable,
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
};

export const useHabits = () => {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error('useHabits must be used within HabitsProvider');
  return ctx;
};
