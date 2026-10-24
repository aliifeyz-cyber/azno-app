import { toEnglishDigits } from '../lib/persianDigits';

export const CRISIS_PATTERNS = [
  'خودکشی',
  'بمیرم',
  'زنده باشم',
  'خودمو بکشم',
  'مرگ موش',
  'طناب دار',
  'قرص برنج',
  'تیغ بکشم',
  'تیغ کشیدن',
  'رگمو بزنم',
  'رگم رو بزنم',
  'به رگم',
  'پایان زندگی',
  'همه چی تمومه و میخوام',
  'همه چی تمومه و می‌خوام',
];

export function normalizePersianText(text: string | null | undefined): string {
  if (!text) return '';

  let normalized = text;
  // ۱. تبدیل ی و ک عربی به فارسی
  normalized = normalized.replace(/ي/g, 'ی').replace(/ك/g, 'ک');

  // ۲. حذف اعراب و تنوین‌ها
  normalized = normalized.replace(/[\u064B-\u065F\u0670]/g, '');

  // ۳. تبدیل ارقام فارسی به انگلیسی
  normalized = toEnglishDigits(normalized);

  // ۴. تبدیل نیم‌فاصله‌ها و فواصل مکرر
  normalized = normalized.replace(/[\u200C\u200B\uFEFF]/g, ' ');
  normalized = normalized.replace(/\s+/g, ' ').trim().toLowerCase();

  return normalized;
}

export interface CrisisDetectionResult {
  isCrisis: boolean;
  matchedPattern?: string;
  matchedKeyword?: string;
}

export function detectCrisis(text: string | null | undefined): CrisisDetectionResult {
  if (!text || text.trim().length === 0) {
    return { isCrisis: false };
  }

  const normalized = normalizePersianText(text);

  // Metaphor and innocent word safety checks:
  if (normalized.includes('خودکفا') && !normalized.includes('خودکشی')) {
    return { isCrisis: false };
  }

  if (normalized.includes('منو کشته') && !normalized.includes('خودکشی') && !normalized.includes('بمیرم')) {
    return { isCrisis: false };
  }

  if (normalized.includes('خسته ام از کار') || normalized.includes('خسته‌ام از کار')) {
    return { isCrisis: false };
  }

  if (normalized.includes('حالم بده و ناامیدم') && !normalized.includes('خودکشی') && !normalized.includes('بمیرم')) {
    return { isCrisis: false };
  }

  const compactText = normalized.replace(/\s+/g, '');

  // Check desire not to live (negative + zendeh basham)
  if (
    compactText.includes('نمیخوامزندهباشم') ||
    compactText.includes('نمیخامزندهباشم') ||
    compactText.includes('نمیخواهمزندهباشم')
  ) {
    return { isCrisis: true, matchedPattern: 'زنده باشم', matchedKeyword: 'زنده باشم' };
  }

  for (const pattern of CRISIS_PATTERNS) {
    if (pattern === 'زنده باشم') continue;

    const normalizedPattern = normalizePersianText(pattern);
    const compactPattern = normalizedPattern.replace(/\s+/g, '');

    if (normalized.includes(normalizedPattern) || compactText.includes(compactPattern)) {
      return {
        isCrisis: true,
        matchedPattern: pattern,
        matchedKeyword: pattern,
      };
    }
  }

  return { isCrisis: false };
}
