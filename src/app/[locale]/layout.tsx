// src/app/[locale]/layout.tsx
import { routing } from '@/i18n/routing';
import { boska } from '@/lib/fonts';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import './globals.css';

// Optimalizované font loading
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  fallback: ['Consolas', 'Monaco', 'monospace'],
  preload: false,
});

// Cached message loader pre PPR
async function getMessages(locale: string) {
  'use cache';
  try {
    const messages = await import(`../../../messages/${locale}.json`);
    return messages.default;
  } catch (error) {
    console.warn(`Failed to load messages for locale ${locale}, falling back to English`);
    const fallback = await import('../../../messages/en.json');
    return fallback.default;
  }
}

// Lazy loaded components s PPR optimalizáciou
const ClientProviders = dynamic(
  () => import('@/components/ClientProviders'),
  {
    loading: () => (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    ),
  }
);

const ClientOnlyWrapperProvider = dynamic(
  () => import('@/components/ClientOnlyWrapperProvider'),
  {
    loading: () => null
  }
);

// Static params generation
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Types
interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

interface MetadataProps {
  params: Promise<{ locale: string }>;
}

// Metadata generation s PPR caching
export async function generateMetadata({ params }: MetadataProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Hero' });
  
  const title = t('title');
  const description = t('description');
  const baseUrl = 'https://adrianfinik.sk';
  const currentUrl = `${baseUrl}${locale === 'sk' ? '' : `/${locale}`}`;
  
  return {
    metadataBase: new URL(baseUrl),
    title: {
      template: '%s | Adrian Finik - Full Stack Developer',
      default: title,
    },
    description,
    keywords: [
      'Adrian Finik',
      'Full Stack Developer',
      'React Developer',
      'Next.js',
      'TypeScript',
      'Web Development',
      'Slovakia',
      'Portfolio',
      'Software Engineer',
    ],
    authors: [{ name: 'Adrian Finik', url: baseUrl }],
    creator: 'Adrian Finik',
    publisher: 'Adrian Finik',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'sk' ? 'sk_SK' : locale === 'cs' ? 'cs_CZ' : 'en_US',
      title,
      description,
      url: currentUrl,
      siteName: 'Adrian Finik',
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&locale=${locale}`,
          width: 1200,
          height: 630,
          alt: `${title} - Adrian Finik Portfolio`,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@adrianfinik',
      creator: '@adrianfinik',
      images: [
        `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&locale=${locale}`,
      ],
    },
    alternates: {
      canonical: currentUrl,
      languages: {
        'en-US': `${baseUrl}/en`,
        'cs-CZ': `${baseUrl}/cs`,
        'sk-SK': baseUrl,
        'x-default': baseUrl,
      },
    },
    other: {
      'msapplication-TileColor': '#000000',
      'theme-color': '#000000',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      'mobile-web-app-capable': 'yes',
    },
  };
}

// JSON-LD generator s async caching
async function generateJsonLd(locale: string, title: string, description: string) {
  'use cache';
  const baseUrl = 'https://adrianfinik.sk';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Adrian Finik',
    givenName: 'Adrian',
    familyName: 'Finik',
    jobTitle: 'Full Stack Developer',
    description,
    url: `${baseUrl}${locale === 'sk' ? '' : `/${locale}`}`,
    image: `${baseUrl}/images/profile.jpg`,
    sameAs: [
      'https://www.linkedin.com/in/adrián-finik-26694536b',
      'https://github.com/Adoosko',
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance',
    },
    knowsAbout: [
      'JavaScript',
      'TypeScript',
      'React',
      'Next.js',
      'Node.js',
      'Full Stack Development',
      'Web Development',
      'Software Engineering',
    ],
    knowsLanguage: [
      {
        '@type': 'Language',
        name: 'Slovak',
        alternateName: 'sk',
      },
      {
        '@type': 'Language',
        name: 'Czech',
        alternateName: 'cs',
      },
      {
        '@type': 'Language',
        name: 'English',
        alternateName: 'en',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'SK',
      addressRegion: 'Slovakia',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'professional',
      availableLanguage: ['Slovak', 'Czech', 'English'],
    },
  };
}

// PPR-enabled layout content
async function LayoutContent({ 
  locale, 
  children 
}: { 
  locale: string; 
  children: React.ReactNode; 
}) {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const isBot = /bot|crawler|spider/i.test(userAgent);

  const messages = await getMessages(locale);
  const t = await getTranslations({ locale, namespace: 'Hero' });
  
  const title = t('title');
  const description = t('description');
  const jsonLd = await generateJsonLd(locale, title, description);

  return (
    <body
      className={`${inter.variable} ${boska.variable} ${jetbrainsMono.variable} font-sans min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary-foreground`}
      suppressHydrationWarning
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        tabIndex={0}
      >
        Skip to main content
      </a>
      
      <div className="min-h-screen bg-background">
        <Suspense 
          fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            </div>
          }
        >
          <ClientProviders locale={locale} messages={messages}>
            <div id="main-content" role="main" tabIndex={-1}>
              {children}
            </div>
            
            {!isBot && <ClientOnlyWrapperProvider />}
          </ClientProviders>
        </Suspense>
      </div>
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
    </body>
  );
}

// Main layout s PPR support
export default async function LocaleLayout({
  children,
  params,
}: LayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html 
      lang={locale} 
      dir="ltr"
      suppressHydrationWarning
      className="scroll-smooth"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-navbutton-color" content="#000000" />
        
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.webp"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.webp"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.webp"/>
        <link rel="manifest" href="/site.webmanifest"/>
      </head>
      
      <Suspense fallback={
        <body className="min-h-screen bg-background">
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        </body>
      }>
        <LayoutContent locale={locale}>
          {children}
        </LayoutContent>
      </Suspense>
    </html>
  );
}
