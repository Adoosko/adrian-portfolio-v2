// middleware.ts
import createMiddleware from 'next-intl/middleware';

// ✅ Priama konfigurácia namiesto importu
export default createMiddleware({
  locales: ['en', 'cs', 'sk'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export const config = {
  matcher: [
    '/',
    '/(cs|sk|en)/:path*'
  ]
};
