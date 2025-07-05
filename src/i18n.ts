import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
 
const locales = ['en', 'cs', 'sk'] as const;
 
type Locale = typeof locales[number];
 
function isValidLocale(locale: any): locale is Locale {
  return locales.includes(locale);
}
 
export default getRequestConfig(async ({locale}) => {
  console.log('Current locale:', locale);
  if (!isValidLocale(locale)) {
    notFound();
  }
 
  const messages = (await import(`../messages/${locale}.json`)).default;
  console.log('Loaded messages:', messages);
 
  return {
    locale,
    messages,
    timeZone: 'Europe/Bratislava'
  };
});