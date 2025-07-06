"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { useAnimationStore } from "@/stores/animation-store";
import { useEffect } from "react";
import { CustomCursor } from "./CustomCursor";
import { LenisProvider } from "./LenisProvider";
import { Toaster } from "./ui/sonner";

import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";

export default function ClientProviders({
  children,
  messages,
  locale,
}: {
  children: React.ReactNode;
  messages: AbstractIntlMessages;
  locale: string;
}) {
  const setAnimateHero = useAnimationStore((state) => state.setAnimateHero);

  useEffect(() => {
    setAnimateHero(true);
  }, [setAnimateHero]);

  return (
    <>
      <CustomCursor />
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <LenisProvider>
            {children}
            <Toaster />
          </LenisProvider>
        </ThemeProvider>
      </NextIntlClientProvider>
    </>
  );
}
