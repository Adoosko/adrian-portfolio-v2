import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
 
const locales = ['en', 'cs', 'sk'] as const;
 
type Locale = typeof locales[number];
 
function isValidLocale(locale: any): locale is Locale {
  return locales.includes(locale);
}
 

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!isValidLocale(locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: 'Europe/Bratislava',
  };
});