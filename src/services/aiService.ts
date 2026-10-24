import { detectCrisis } from '../domain/crisisDetector';

export interface AIResponse {
  text: string;
  isCrisis: boolean;
  matchedCrisisKeyword?: string;
}

export interface AIProvider {
  generateResponse(userText: string, context?: { heroName?: string; habitCount?: number }): Promise<AIResponse>;
}

export class MockAIProvider implements AIProvider {
  async generateResponse(userText: string, context?: { heroName?: string }): Promise<AIResponse> {
    const heroName = context?.heroName || 'ازمن';

    // 1. First check for crisis
    const crisisCheck = detectCrisis(userText);
    if (crisisCheck.isCrisis) {
      return {
        text: `نگرانت شدم رفیق. من «${heroName}» هستم و همیشه در کنارت، ولی وقتی بار زندگی اینقدر سنگین میشه حتماً باید با یه متخصص یا آدم امین صحبت کنی. لطفاً به شماره‌های زیر نگاهی بنداز، زندگی و آرامش تو بالاتر از هر عادتیه.`,
        isCrisis: true,
        matchedCrisisKeyword: crisisCheck.matchedKeyword,
      };
    }

    // 2. Normal thoughtful responses based on user sentiment/keywords
    const lower = userText.toLowerCase();

    if (lower.includes('سخت') || lower.includes('خسته') || lower.includes('نمیتونم') || lower.includes('نمی‌تونم') || lower.includes('بریدم')) {
      return {
        text: `می‌فهمم رفیق، روزهای سخت دقیقاً جایی هستن که تغییر واقعی توشون ساخته میشه. اصلاً قرار نیست امروز همه‌چیز بی‌نقص باشه. فقط یک گام خیلی کوچیک (حتی در حد ۱ دقیقه) بردار و بعد به خودت استراحت بده. من کنارتم.`,
        isCrisis: false,
      };
    }

    if (lower.includes('لغز') || lower.includes('شکست') || lower.includes('خراب') || lower.includes('دوباره انجام دادم')) {
      return {
        text: `لغزش بخشی از یادگیری مسیره، نه پایان ماجرا! با خودت مهربان باش. مهم اینه که دست از تلاش نکشیدی و الان اینجایی. چی شد که این اتفاق افتاد؟ بیا به جای سرزنش، کشف کنیم چطور بار بعد پیشگیریش کنیم.`,
        isCrisis: false,
      };
    }

    if (lower.includes('سلام') || lower.includes('درود') || lower.includes('چطوری')) {
      return {
        text: `سلام رفیق بااراده! من «${heroName}» پرانرژی و مشتاقم که امروز هم هم‌قدم بشیم. بگو ببینم امروز برای ساختن کدوم عادت یا هدف آماده‌ای؟`,
        isCrisis: false,
      };
    }

    if (lower.includes('ممنون') || lower.includes('مرسی') || lower.includes('تشکر')) {
      return {
        text: `قربانت رفیق! همراهی با تو باعث افتخاره. هر زمان خواستی روی کمک و انگیزه‌بخشی من حساب کن. گام بعدی رو با قدرت بردار!`,
        isCrisis: false,
      };
    }

    return {
      text: `شنیدمت رفیق. هر قدمی که برمی‌داری ارزش داره. به فرآیند اعتماد کن، عجله نکن و استمرار رو حفظ کن. من «${heroName}» تا خط پایان همراهتم!`,
      isCrisis: false,
    };
  }
}

export const aiService: AIProvider = new MockAIProvider();
