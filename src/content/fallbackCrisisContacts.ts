export interface CrisisContact {
  id: string;
  name: string;
  number: string;
  description: string;
  isOfficial: boolean;
}

/**
 * خطوط اضطراری و پشتیبانی رایگان و شبانه‌روزی
 * توجه: این شماره‌ها قبل از انتشار با منابع رسمی تایید شوند.
 */
export const FALLBACK_CRISIS_CONTACTS: CrisisContact[] = [
  {
    id: '115',
    name: 'اورژانس پزشکی',
    number: '115',
    description: 'برای خطر جانی فوری و نیاز به امداد پزشکی',
    isOfficial: true,
  },
  {
    id: '1480',
    name: 'صدای مشاور بهزیستی',
    number: '1480',
    description: 'مشاوره‌ی تلفنی تخصصی و رایگان برای آرامش ذهن و بحران‌های روانی',
    isOfficial: true,
  },
  {
    id: '123',
    name: 'اورژانس اجتماعی',
    number: '123',
    description: 'برای آسیب‌های اجتماعی، اختلافات حاد و بحران‌های خانوادگی',
    isOfficial: true,
  },
];
