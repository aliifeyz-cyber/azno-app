import { normalizePersianText } from './crisisDetector';
import { toEnglishDigits } from '../lib/persianDigits';

export const PROFANE_WORDS = [
  'احمق',
  'بیشعور',
  'بی‌عرضه',
  'تنبل',
  'عوضی',
  'آشغال',
  'لاشی',
  'کثافت',
];

const PHONE_REGEX = /(\+?98|0)?9\d{9}|(0\d{2,3})?\d{7,8}/;
const URL_REGEX = /(https?:\/\/|www\.)[^\s]+/;

export interface ContentFilterResult {
  isValid: boolean;
  isAllowed: boolean;
  error?: string;
  reason?: string;
}

/**
 * پالایش محتوا برای سلامت کامیونیتی و ورودی‌های متنی
 */
export function validateContentText(text: string): ContentFilterResult {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return {
      isValid: false,
      isAllowed: false,
      error: 'متن نمی‌تواند خالی باشد.',
      reason: 'متن نمی‌تواند خالی باشد.',
    };
  }

  const normalized = normalizePersianText(trimmed);

  for (const word of PROFANE_WORDS) {
    const normalizedWord = normalizePersianText(word);
    if (normalized.includes(normalizedWord)) {
      const msg = 'متن ارسالی حاوی کلمات نامناسب یا تندخویانه است.';
      return {
        isValid: false,
        isAllowed: false,
        error: msg,
        reason: msg,
      };
    }
  }

  // Convert digits to English for regex checking
  const englishText = toEnglishDigits(trimmed);

  if (PHONE_REGEX.test(englishText)) {
    const msg = 'درج شماره تماس به دلایل حریم خصوصی مجاز نیست.';
    return {
      isValid: false,
      isAllowed: false,
      error: msg,
      reason: msg,
    };
  }

  if (URL_REGEX.test(trimmed)) {
    const msg = 'درج لینک اینترنتی یا تبلیغات مجاز نیست.';
    return {
      isValid: false,
      isAllowed: false,
      error: msg,
      reason: msg,
    };
  }

  return { isValid: true, isAllowed: true };
}

export const filterContent = validateContentText;
