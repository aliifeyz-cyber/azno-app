import { describe, it, expect } from 'vitest';
import { filterContent } from '../src/domain/contentFilter';

describe('contentFilter', () => {
  it('allows friendly supportive Persian community text', () => {
    const res = filterContent('سلام دوستان، امروز روز پنجم بیداری سر ساعت ۶ صبح بود و عالی پیش رفت!');
    expect(res.isAllowed).toBe(true);
  });

  it('blocks profanity or inappropriate words', () => {
    const res = filterContent('این چه گروه آشغالیه');
    expect(res.isAllowed).toBe(false);
  });

  it('blocks phone numbers with Iranian format 09xxxxxxxxx', () => {
    const res = filterContent('برای ارتباط به این شماره پیام بدید: 09123456789');
    expect(res.isAllowed).toBe(false);
    expect(res.reason).toContain('شماره');
  });

  it('blocks phone numbers written in Persian digits', () => {
    const res = filterContent('تلفن من ۰۹۱۲۳۴۵۶۷۸۹ هست');
    expect(res.isAllowed).toBe(false);
  });

  it('blocks external links and URLs', () => {
    const res = filterContent('برای دیدن لینک به https://example.com سر بزنید');
    expect(res.isAllowed).toBe(false);
    expect(res.reason).toContain('لینک');
  });
});
