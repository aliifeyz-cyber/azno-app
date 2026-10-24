export type TextGroupKey =
  | 'auth'
  | 'onboarding'
  | 'today'
  | 'celebrations'
  | 'slip'
  | 'coach'
  | 'crisis'
  | 'community'
  | 'profile'
  | 'habit'
  | 'notifications'
  | 'legal';

export const TEXT_GROUPS: Record<TextGroupKey, string> = {
  auth: 'ورود و ثبت‌نام',
  onboarding: 'آشنایی و آنبوردینگ',
  today: 'تب امروز و اقدامات روزانه',
  celebrations: 'جشن‌ها و پیام‌های تبریک',
  slip: 'لغزش و بررسی دلایل',
  coach: 'مربی و همراه گفتگو',
  crisis: 'کارت بحران و شماره‌های اضطراری',
  community: 'کامیونیتی و گروه‌ها',
  profile: 'پروفایل و تنظیمات',
  habit: 'مدیریت و ساخت عادت‌ها',
  notifications: 'اعلان‌ها و یادآورها',
  legal: 'حریم خصوصی و قوانین',
};

export interface TextDef {
  key: string;
  group: TextGroupKey;
  description: string;
  defaultValue: string;
  placeholders: string[];
  isProtected?: boolean;
  isMultiline?: boolean;
  maxLength?: number;
}

export const DEFAULT_TEXTS_MAP: Record<string, TextDef> = {
  // Auth
  'auth.login.title': {
    key: 'auth.login.title',
    group: 'auth',
    description: 'عنوان صفحه ورود',
    defaultValue: 'خوش آمدید به ازنو',
    placeholders: [],
  },
  'auth.login.subtitle': {
    key: 'auth.login.subtitle',
    group: 'auth',
    description: 'زیرعنوان صفحه ورود',
    defaultValue: 'آغاز مسیری تازه برای ساختن عادت‌های پایدار',
    placeholders: [],
  },
  'auth.name.label': {
    key: 'auth.name.label',
    group: 'auth',
    description: 'برچسب نام کاربر در فرم ورود',
    defaultValue: 'نام یا نام مستعار شما',
    placeholders: [],
  },
  'auth.submit.btn': {
    key: 'auth.submit.btn',
    group: 'auth',
    description: 'دکمه ورود به برنامه',
    defaultValue: 'ورود و ادامه مسیر',
    placeholders: [],
  },

  // Onboarding
  'onboarding.welcome.title': {
    key: 'onboarding.welcome.title',
    group: 'onboarding',
    description: 'عنوان خوش‌آمدگویی آنبوردینگ',
    defaultValue: 'با همراه اختصاصی‌ات آشنا شو',
    placeholders: [],
  },
  'onboarding.welcome.subtitle': {
    key: 'onboarding.welcome.subtitle',
    group: 'onboarding',
    description: 'توضیح کوتاه آنبوردینگ',
    defaultValue: 'این استیکر قهرمان با شنل فیروزه‌ای و نشان جرقه در تمام مسیر هم‌قدم توست.',
    placeholders: [],
  },
  'onboarding.name_azman.label': {
    key: 'onboarding.name_azman.label',
    group: 'onboarding',
    description: 'برچسب انتخاب نام همراه قهرمان',
    defaultValue: 'نام همراه قهرمان شما',
    placeholders: [],
  },
  'onboarding.start.btn': {
    key: 'onboarding.start.btn',
    group: 'onboarding',
    description: 'دکمه شروع ماجراجویی',
    defaultValue: 'شروع سفر با همراه من',
    placeholders: [],
  },

  // Today
  'today.title': {
    key: 'today.title',
    group: 'today',
    description: 'عنوان بخش عادت‌های امروز',
    defaultValue: 'عادت‌های امروز شما',
    placeholders: [],
  },
  'today.empty.title': {
    key: 'today.empty.title',
    group: 'today',
    description: 'عنوان حالت خالی تب امروز',
    defaultValue: 'هنوز عادتی ثبت نکرده‌ای!',
    placeholders: [],
  },
  'today.empty.desc': {
    key: 'today.empty.desc',
    group: 'today',
    description: 'توضیح حالت خالی تب امروز',
    defaultValue: 'یک عادت ساده و کوچک بساز تا مسیر تغییر را با هم شروع کنیم.',
    placeholders: [],
  },

  // Slip
  'slip.modal.title': {
    key: 'slip.modal.title',
    group: 'slip',
    description: 'عنوان دیالوگ لغزش',
    defaultValue: 'اشکالی نداره رفیق، زمین خوردن بخشی از یادگیریه',
    placeholders: [],
  },
  'slip.modal.subtitle': {
    key: 'slip.modal.subtitle',
    group: 'slip',
    description: 'پیام دلگرم‌کننده در هنگام لغزش',
    defaultValue: 'مهم اینه که اینجایی و جا نزدی. برای عادت «{habit}» بیا ببینیم چه عاملی پیش اومد:',
    placeholders: ['habit'],
  },

  // Habit
  'habit.create.btn': {
    key: 'habit.create.btn',
    group: 'habit',
    description: 'دکمه ساخت عادت جدید',
    defaultValue: 'ثبت و شروع عادت',
    placeholders: [],
  },

  // Community
  'community.title': {
    key: 'community.title',
    group: 'community',
    description: 'عنوان تب جامعه و همسفران',
    defaultValue: 'همسفران و گروه‌ها',
    placeholders: [],
  },

  // Profile
  'profile.title': {
    key: 'profile.title',
    group: 'profile',
    description: 'عنوان صفحه پروفایل',
    defaultValue: 'پروفایل و تنظیمات',
    placeholders: [],
  },

  // Coach
  'coach.welcome': {
    key: 'coach.welcome',
    group: 'coach',
    description: 'پیام آغازین مربی',
    defaultValue: 'سلام رفیق! من «{hero}» هستم. امروز برای چه هدفی کنارت باشم؟',
    placeholders: ['hero'],
  },

  // Crisis
  'crisis.title': {
    key: 'crisis.title',
    group: 'crisis',
    description: 'عنوان مودال بحران',
    defaultValue: 'تو تنها نیستی؛ همراهتیم',
    placeholders: [],
    isProtected: true,
  },
  'crisis.desc': {
    key: 'crisis.desc',
    group: 'crisis',
    description: 'متن راهنمای بحران روانی',
    defaultValue: 'اگر احساس می‌کنی فشار روحی بیش از توان شده، با خطوط تخصصی و رایگان تماس بگیر.',
    placeholders: [],
    isProtected: true,
  },

  // Notifications
  'notification.reminder': {
    key: 'notification.reminder',
    group: 'notifications',
    description: 'قالب اعلان یادآور عادت',
    defaultValue: '{hero}: وقت انجام {habit} رسیده!',
    placeholders: ['hero', 'habit'],
  },
};
