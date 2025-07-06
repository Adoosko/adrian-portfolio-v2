// src/app/[locale]/layout.tsx
import ClientProviders from "@/components/ClientProviders";
import CookieConsentComponent from "@/components/CookieConsent";
import { routing } from "@/i18n/routing";
import { boska } from "@/lib/fonts";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Inter, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import './globals.css';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  fallback: ["monospace"],
});

// src/app/[locale]/layout.tsx

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'cs' }, { locale: 'sk' }];
}

// Definícia vlastných typov pre async params
interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{locale:string}>;
}

interface MetadataProps {
  params: Promise<{locale:string}>;
}

export async function generateMetadata({ params }: MetadataProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Hero' });
  const title = t('title');
  const description = t('description');

  return {
    metadataBase: new URL('https://adrianfinik.sk'),
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://adrianfinik.sk/${locale === 'sk' ? '' : locale}`,
      images: [
        {
          url: `/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(description)}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(description)}`],
    },
    alternates: {
      canonical: `https://adrianfinik.sk/${locale === 'sk' ? '' : locale}`,
      languages: {
        'en': 'https://adrianfinik.sk/en',
        'cs': 'https://adrianfinik.sk/cs',
        'sk': 'https://adrianfinik.sk',
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const t = await getTranslations({ locale, namespace: "Hero" });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${boska.variable} ${jetbrainsMono.variable} font-sans min-h-screen bg-background text-foreground antialiased`}
        suppressHydrationWarning
      >
        <ClientProviders locale={locale} messages={messages}>
          {children}
          <CookieConsentComponent />
        </ClientProviders>
      </body>
    </html>
  );
}
