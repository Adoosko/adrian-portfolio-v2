// src/app/[locale]/layout.tsx
import { routing } from '@/i18n/routing';

import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import './globals.css';

// Optimalizované font loading pre advanced SEO
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
  preload: true,
  adjustFontFallback: false,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  fallback: ['Consolas', 'Monaco', 'Courier New', 'monospace'],
  preload: false,
  adjustFontFallback: false,
});

// Turbopack optimalizované dynamic imports
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
    loading: () => null,
    
  }
);

// Advanced SEO message loader
async function getMessages(locale: string) {
  try {
    const messages = await import(`../../../messages/${locale}.json`);
    return messages.default;
  } catch (error) {
    console.warn(`Failed to load messages for locale ${locale}, falling back to English`);
    const fallback = await import('../../../messages/en.json');
    return fallback.default;
  }
}

// Advanced static params generation
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

// Advanced SEO metadata generation
export async function generateMetadata({ params }: MetadataProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Hero' });
  
  const title = t('title');
  const description = t('description');
  const baseUrl = 'https://adrianfinik.sk';
  const currentUrl = `${baseUrl}${locale === 'sk' ? '' : `/${locale}`}`;
  
  // Advanced SEO keywords generation
  const keywords = [
    'Adrian Finik',
    'Full Stack Developer',
    'React Developer',
    'Next.js Developer',
    'TypeScript Expert',
    'Web Development Slovakia',
    'Frontend Developer',
    'Backend Developer',
    'JavaScript Developer',
    'Node.js Developer',
    'Portfolio Website',
    'Software Engineer',
    'Web Applications',
    'UI/UX Development',
    'Mobile-First Development',
    'Performance Optimization',
    'SEO Optimization',
    'Modern Web Technologies',
    locale === 'sk' ? 'Vývojár Slovensko' : '',
    locale === 'sk' ? 'Webové aplikácie' : '',
    locale === 'cs' ? 'Vývojář Česko' : '',
    locale === 'cs' ? 'Webové aplikace' : '',
  ].filter(Boolean);

  return {
    metadataBase: new URL(baseUrl),
    title: {
      template: '%s | Adrian Finik - Full Stack Developer',
      default: title,
    },
    description,
    keywords: keywords.join(', '),
    authors: [{ 
      name: 'Adrian Finik', 
      url: baseUrl 
    }],
    creator: 'Adrian Finik',
    publisher: 'Adrian Finik',
    category: 'Technology',
    classification: 'Business',
    
    // Advanced Open Graph
    openGraph: {
      type: 'website',
      locale: locale === 'sk' ? 'sk_SK' : locale === 'cs' ? 'cs_CZ' : 'en_US',
      title,
      description,
      url: currentUrl,
      siteName: 'Adrian Finik - Full Stack Developer',
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&locale=${locale}`,
          width: 1200,
          height: 630,
          alt: `${title} - Adrian Finik Portfolio`,
          type: 'image/png',
        },
        {
          url: `/api/og/square?title=${encodeURIComponent(title)}&locale=${locale}`,
          width: 1200,
          height: 1200,
          alt: `${title} - Adrian Finik Square`,
          type: 'image/png',
        },
      ],
      emails: ['adoosdeveloper@gmail.com'],
      countryName: 'Slovakia',
    },
    
    // Advanced Twitter Cards
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@adrianfinik',
      site: '@adrianfinik',
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&locale=${locale}`,
          alt: `${title} - Adrian Finik Portfolio`,
        },
      ],
    },
    
    // Advanced Robots Configuration
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
    
    // Advanced Alternates
    alternates: {
      canonical: currentUrl,
      languages: {
        'en-US': `${baseUrl}/en`,
        'cs-CZ': `${baseUrl}/cs`,
        'sk-SK': baseUrl,
        'x-default': baseUrl,
      },
      media: {
        'only screen and (max-width: 600px)': `${baseUrl}/mobile`,
      },
      types: {
        'application/rss+xml': `${baseUrl}/rss.xml`,
        'application/atom+xml': `${baseUrl}/atom.xml`,
      },
    },
    
    // Advanced Verification
    verification: {
      google: 'google-site-verification-code',
      yandex: 'yandex-verification-code',
      yahoo: 'yahoo-site-verification-code',
      other: {
        'msvalidate.01': 'bing-site-verification-code',
        'facebook-domain-verification': 'facebook-domain-verification-code',
      },
    },
    
    // Advanced App Links
    appLinks: {
      web: {
        url: currentUrl,
        should_fallback: true,
      },
    },
    
    // Advanced Other Meta Tags
    other: {
      'msapplication-TileColor': '#000000',
      'theme-color': '#000000',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      'mobile-web-app-capable': 'yes',
      'application-name': 'Adrian Finik Portfolio',
      'apple-mobile-web-app-title': 'Adrian Finik',
      'format-detection': 'telephone=no',
      'msapplication-tap-highlight': 'no',
      'msapplication-config': '/browserconfig.xml',
      'referrer': 'origin-when-cross-origin',
      'color-scheme': 'dark light',
      'supported-color-schemes': 'dark light',
      'rating': 'general',
      'distribution': 'global',
      'revisit-after': '7 days',
      'expires': 'never',
      'pragma': 'no-cache',
      'cache-control': 'no-cache, no-store, must-revalidate',
      'geo.region': 'SK',
      'geo.country': 'Slovakia',
      'geo.position': '48.1486;17.1077',
      'ICBM': '48.1486, 17.1077',
      'coverage': 'Worldwide',
      'target': 'all',
      'HandheldFriendly': 'True',
      'MobileOptimized': '320',
      'og:see_also': JSON.stringify([
        'https://github.com/Adoosko',
        'https://www.linkedin.com/in/adrián-finik-26694536b',
      ]),
    },
    
    // Advanced Manifest
    manifest: '/manifest.json',
    
    // Advanced Icons
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
        { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
      shortcut: '/favicon.ico',
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
      other: [
        {
          rel: 'mask-icon',
          url: '/safari-pinned-tab.svg',
          color: '#000000',
        },
      ],
    },
  };
}

// Advanced JSON-LD structured data generator
async function generateAdvancedJsonLd(locale: string, title: string, description: string) {
  const baseUrl = 'https://adrianfinik.sk';
  const currentUrl = `${baseUrl}${locale === 'sk' ? '' : `/${locale}`}`;
  
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${baseUrl}#person`,
    name: 'Adrian Finik',
    givenName: 'Adrian',
    familyName: 'Finik',
    alternateName: ['Adrián Finik', 'Adrian F.', 'AF'],
    jobTitle: 'Full Stack Developer',
    description,
    url: currentUrl,
    image: {
      '@type': 'ImageObject',
      url: `${baseUrl}/images/adrian-finik-profile.jpg`,
      width: 400,
      height: 400,
      caption: 'Adrian Finik - Full Stack Developer'
    },
    sameAs: [
      'https://www.linkedin.com/in/adrián-finik-26694536b',
      'https://github.com/Adoosko',
      'https://twitter.com/adrianfinik',
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance',
      sameAs: baseUrl,
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
      'UI/UX Design',
      'Database Design',
      'API Development',
      'Cloud Computing',
      'DevOps',
      'Mobile Development',
      'Performance Optimization',
      'SEO Optimization',
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
      addressLocality: 'Bratislava',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'professional',
      email: 'adoosdeveloper@gmail.com',
      availableLanguage: ['Slovak', 'Czech', 'English'],
    },
    alumniOf: {
      '@type': 'Organization',
      name: 'Technical University',
      sameAs: 'https://www.stuba.sk/',
    },
    award: [
      'Certified React Developer',
      'Next.js Expert',
      'Full Stack Certification',
    ],
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Full Stack Developer',
      occupationLocation: {
        '@type': 'Country',
        name: 'Slovakia',
      },
      skills: [
        'JavaScript',
        'TypeScript',
        'React',
        'Next.js',
        'Node.js',
        'Database Design',
        'API Development',
      ],
    },
    owns: {
      '@type': 'Website',
      name: 'Adrian Finik Portfolio',
      url: baseUrl,
      description: 'Professional portfolio showcasing full stack development projects',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'Website',
    '@id': `${baseUrl}#website`,
    name: 'Adrian Finik - Full Stack Developer',
    alternateName: 'Adrian Finik Portfolio',
    description,
    url: baseUrl,
    inLanguage: [
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
    isAccessibleForFree: true,
    isFamilyFriendly: true,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    copyrightYear: new Date().getFullYear(),
    copyrightHolder: {
      '@type': 'Person',
      name: 'Adrian Finik',
      url: baseUrl,
    },
    creator: {
      '@type': 'Person',
      name: 'Adrian Finik',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Person',
      name: 'Adrian Finik',
      url: baseUrl,
    },
    mainEntity: {
      '@id': `${baseUrl}#person`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    sameAs: [
      'https://www.linkedin.com/in/adrián-finik-26694536b',
      'https://github.com/Adoosko',
    ],
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}#organization`,
    name: 'Adrian Finik Development',
    alternateName: 'AF Development',
    description: 'Professional web development services',
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/images/logo.png`,
      width: 200,
      height: 200,
    },
    sameAs: [
      'https://www.linkedin.com/in/adrián-finik-26694536b',
      'https://github.com/Adoosko',
    ],
    founder: {
      '@type': 'Person',
      name: 'Adrian Finik',
      url: baseUrl,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+421-XXX-XXX-XXX',
      contactType: 'customer service',
      email: 'adoosdeveloper@gmail.com',
      availableLanguage: ['Slovak', 'Czech', 'English'],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'SK',
      addressRegion: 'Slovakia',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Slovakia',
    },
    knowsAbout: [
      'Web Development',
      'Full Stack Development',
      'React Development',
      'Next.js Development',
      'TypeScript Development',
    ],
    slogan: 'Building modern web applications with cutting-edge technologies',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${currentUrl}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      ...(locale !== 'sk' ? [{
        '@type': 'ListItem',
        position: 2,
        name: locale.toUpperCase(),
        item: currentUrl,
      }] : []),
    ],
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      personSchema,
      websiteSchema,
      organizationSchema,
      breadcrumbSchema,
    ],
  };
}

// Advanced layout content component
async function LayoutContent({ 
  locale, 
  children 
}: { 
  locale: string; 
  children: React.ReactNode; 
}) {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const isBot = /bot|crawler|spider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram/i.test(userAgent);

  const messages = await getMessages(locale);
  const t = await getTranslations({ locale, namespace: 'Hero' });
  
  const title = t('title');
  const description = t('description');
  const jsonLd = await generateAdvancedJsonLd(locale, title, description);

  return (
    <body
      className={`${inter.variable} ${jetbrainsMono.variable} font-sans min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary-foreground`}
      suppressHydrationWarning
    >
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        tabIndex={0}
      >
        Skip to main content
      </a>
      
      {/* Main content wrapper */}
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
      
      {/* Advanced JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      
      {/* Additional SEO scripts */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Performance mark for analytics
            if (typeof performance !== 'undefined') {
              performance.mark('layout-complete');
            }
            
            // Preload critical resources
            const preloadCriticalResources = () => {
             
              
              criticalImages.forEach(src => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = src;
                document.head.appendChild(link);
              });
            };
            
            // Run after DOM is loaded
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', preloadCriticalResources);
            } else {
              preloadCriticalResources();
            }
          `,
        }}
      />
    </body>
  );
}

// Main layout component with advanced SEO
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
        {/* Critical resource hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//vercel.com" />
        <link rel="dns-prefetch" href="//github.com" />
        <link rel="dns-prefetch" href="//linkedin.com" />
        
        {/* Advanced viewport configuration */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Advanced theme colors */}
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-navbutton-color" content="#000000" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        
        {/* Advanced favicons */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Additional meta tags for SEO */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* RSS feeds */}
        <link rel="alternate" type="application/rss+xml" title="Adrian Finik Blog RSS" href="/rss.xml" />
        <link rel="alternate" type="application/atom+xml" title="Adrian Finik Blog Atom" href="/atom.xml" />
        
        {/* Sitemap */}
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
        
        {/* Critical CSS preload */}
       
        
        {/* Preload critical fonts */}
        <link rel="preload" href="/fonts/inter-latin-400.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/boska-latin-400.woff2" as="font" type="font/woff2" crossOrigin="" />
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
