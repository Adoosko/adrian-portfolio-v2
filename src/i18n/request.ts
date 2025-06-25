// i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

type Locale = 'en' | 'cs' | 'sk';

export default getRequestConfig(async ({ requestLocale }): Promise<{
  locale: string;
  messages: any;
}> => {
  const locale = (await requestLocale) || routing.defaultLocale;
  
  console.log('🌍 Using locale:', locale);
  
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});
