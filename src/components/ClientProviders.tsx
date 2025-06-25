"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { useAnimationStore } from "@/stores/animation-store";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { LenisProvider } from "./LenisProvider";
import Loader from "./ui/loader";

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
  const [isLoading, setIsLoading] = useState(true);
  const setAnimateHero = useAnimationStore((state) => state.setAnimateHero);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setAnimateHero(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [setAnimateHero]);

  return (
    <>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <LenisProvider>{children}</LenisProvider>
        </ThemeProvider>
      </NextIntlClientProvider>

      <AnimatePresence>
        {isLoading && <Loader key="loader" />}
      </AnimatePresence>
    </>
  );
}
