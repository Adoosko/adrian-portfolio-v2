// src/components/ClientProviders.tsx
'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';
import { ReactNode, useEffect, useState } from 'react';
import { Toaster } from 'sonner';

interface ClientProvidersProps {
  children: ReactNode;
  locale: string;
  messages: any;
}

export default function ClientProviders({ 
  children, 
  locale, 
  messages 
}: ClientProvidersProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    );
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange={false}
      >
        {children}
        <Toaster 
          position="top-right" 
          expand={true}
          richColors
          closeButton
          toastOptions={{
            duration: 4000,
            className: 'font-mono',
          }}
        />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
