// app/[locale]/layout.tsx
import ClientProviders from "@/components/ClientProviders";
import { routing } from "@/i18n/routing";
import { boska } from "@/lib/fonts";
import { hasLocale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { Inter, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import './globals.css';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "Hero" });
  const title = t("title");
  const description = t("description");

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://adrianfinik.com" />
        <meta property="og:image" content={`/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(description)}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={title} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(description)}`} />
      </head>
      <body
        className={`${inter.variable} ${boska.variable} ${jetbrainsMono.variable} min-h-screen bg-background text-foreground antialiased`}
        suppressHydrationWarning
      >
        <ClientProviders locale={locale} messages={messages}>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
