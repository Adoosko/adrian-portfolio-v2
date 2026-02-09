// middleware.ts
import createMiddleware from 'next-intl/middleware';

// ✅ Priama konfigurácia namiesto importu
export default createMiddleware({
  locales: ['en', 'cs', 'sk'],
  defaultLocale: 'sk',
  localePrefix: 'as-needed'
});

export const config = {
  matcher: [
    '/',
    '/(cs|sk|en)/:path*'
  ]
};
