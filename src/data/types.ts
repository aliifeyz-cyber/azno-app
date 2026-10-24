import { HeroStyleKey } from '../content/azmanMessages';

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  plan: 'free' | 'gold' | 'diamond';
  heroName: string;
  heroStyle: HeroStyleKey;
  onboardingCompleted: boolean;
  masterRemindersEnabled: boolean;
  themeMode: 'light' | 'dark';
  createdAt: string;
}

export type HabitType = 'build' | 'quit';
export type HabitActionStatus = 'none' | 'done' | 'skipped' | 'slipped';

export interface HabitLog {
  date: string; // YYYY-MM-DD
  dayIndex: number;
  status: HabitActionStatus;
  mood?: number; // 1 to 5
  note?: string;
}

export interface HabitStep {
  id: string;
  habitId?: string;
  title: string;
  targetDays: number;
  startDate: string; // YYYY-MM-DD
  status: 'pending' | 'active' | 'done';
}

export interface Habit {
  id: string;
  title: string;
  category: string;
  type: HabitType;
  currentStreak: number;
  bestStreak: number;
  currentStepTitle: string;
  currentStepIndex: number;
  targetDays: number;
  doneDaysInStep: number;
  reminderTime?: string;
  showNameInReminder: boolean;
  escalationEnabled: boolean;
  statusToday: HabitActionStatus;
  trigger?: string;
  microStep?: string;
  logs: HabitLog[];
  steps?: HabitStep[];
}

export interface CommunityGroup {
  id: string;
  title: string;
  slug: string;
  description: string;
  memberCount: number;
  isMember: boolean;
  myAnonName: string;
  rules: string;
}

export type ReactionType = 'support' | 'proud' | 'empathy';

export interface CommunityPost {
  id: string;
  groupId: string;
  authorAnonName: string;
  content: string;
  timeAgo: string;
  createdAt: string;
  isMe: boolean;
  reactionsCount: {
    support: number;
    proud: number;
    empathy: number;
  };
  myReaction: ReactionType | null;
  commentsCount: number;
}

export interface CommunityComment {
  id: string;
  postId: string;
  authorAnonName: string;
  content: string;
  timeAgo: string;
  createdAt: string;
  isMe: boolean;
}

export interface CommunityReport {
  id: string;
  targetType: 'post' | 'comment';
  targetId: string;
  reason: string;
  reasonLabel: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  contentPreview: string;
  createdAtText: string;
}

export interface CoachMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
  isCrisis?: boolean;
}
