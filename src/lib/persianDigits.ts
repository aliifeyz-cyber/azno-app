/**
 * تبدیل ارقام انگلیسی به فارسی
 */
export function toPersianDigits(input: string | number | null | undefined): string {
  if (input === null || input === undefined) return '';
  const str = input.toString();
  const english = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  let result = str;
  for (let i = 0; i < english.length; i++) {
    result = result.replaceAll(english[i], persian[i]);
  }
  return result;
}

/**
 * تبدیل ارقام فارسی به انگلیسی
 */
export function toEnglishDigits(input: string | null | undefined): string {
  if (!input) return '';
  const persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const english = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let result = input;
  for (let i = 0; i < persian.length; i++) {
    result = result.replaceAll(persian[i], english[i]);
  }
  return result;
}
