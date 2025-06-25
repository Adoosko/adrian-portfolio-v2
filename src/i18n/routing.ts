import { defineRouting } from 'next-intl/routing';
 
export const locales = ['en', 'cs', 'sk'] as const;

export const routing = defineRouting({
  // A list of all locales that are supported
  locales,
 
  // Used when no locale matches
  defaultLocale: 'sk',
  localePrefix: 'always', // Vždy zobraz locale v URL
  localeDetection: true   // Povoľ automatickú detekciu
});