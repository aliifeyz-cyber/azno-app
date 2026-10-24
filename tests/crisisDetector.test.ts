import { describe, it, expect } from 'vitest';
import { detectCrisis, normalizePersianText } from '../src/domain/crisisDetector';

describe('crisisDetector', () => {
  it('Scenario 1: detects explicit suicide intent', () => {
    const res = detectCrisis('می‌خوام خودکشی کنم');
    expect(res.isCrisis).toBe(true);
  });

  it('Scenario 2: detects desire not to live', () => {
    const res = detectCrisis('دیگه نمی‌خوام زنده باشم');
    expect(res.isCrisis).toBe(true);
  });

  it('Scenario 3: detects feeling everything is over and wanting to end life', () => {
    const res = detectCrisis('حس می‌کنم همه چی تمومه و می‌خوام خودمو بکشم');
    expect(res.isCrisis).toBe(true);
  });

  it('Scenario 4: detects rat poison lethal phrase', () => {
    const res = detectCrisis('رفتم مرگ موش خریدم');
    expect(res.isCrisis).toBe(true);
  });

  it('Scenario 5: detects noose rope lethal phrase', () => {
    const res = detectCrisis('طناب دار آماده کردم');
    expect(res.isCrisis).toBe(true);
  });

  it('Scenario 6: detects Arabic letter variations (ي/ی, ك/ک) and half-spaces', () => {
    // With Arabic yeh and kaf: خودكشي
    const res = detectCrisis('فكرم درگير خودكشي شده');
    expect(res.isCrisis).toBe(true);
  });

  it('Scenario 7: does NOT flag innocent words like خودکفا', () => {
    const res = detectCrisis('می‌خوام در کارم کاملاً خودکفا بشم و پیشرفت کنم');
    expect(res.isCrisis).toBe(false);
  });

  it('Scenario 8: does NOT flag metaphors like "این عادت منو کشته"', () => {
    const res = detectCrisis('این عادت بیدار شدن ساعت ۶ صبح منو کشته از بس سخته');
    expect(res.isCrisis).toBe(false);
  });

  it('Scenario 9: does NOT flag general tiredness from work', () => {
    const res = detectCrisis('خیلی خسته‌ام از کار و پروژه‌ها');
    expect(res.isCrisis).toBe(false);
  });

  it('Scenario 10: detects rice tablet (phosphide poison)', () => {
    const res = detectCrisis('دنبال قرص برنج می‌گردم');
    expect(res.isCrisis).toBe(true);
  });

  it('Scenario 11: detects wrist-slitting intent', () => {
    const res = detectCrisis('می‌خوام به رگم تیغ بکشم');
    expect(res.isCrisis).toBe(true);
  });

  it('Scenario 12: does NOT flag normal sad or disappointed feelings', () => {
    const res = detectCrisis('امروز حالم بده و ناامیدم از نرسیدن به اهدافم');
    expect(res.isCrisis).toBe(false);
  });

  it('correctly normalizes Persian text (removes diacritics and converts numbers)', () => {
    const normalized = normalizePersianText('خَوْدکُشی ۱۲۳');
    expect(normalized).toContain('خودکشی');
    expect(normalized).toContain('123');
  });
});
