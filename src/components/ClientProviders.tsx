"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { useAnimationStore } from "@/stores/animation-store";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import dynamic from "next/dynamic";
import { useEffect } from "react";

const Toaster = dynamic(
  () => import("./ui/sonner").then((m) => m.Toaster),
  {
    ssr: false,
  },
);

const CustomCursor = dynamic(
  () => import("./CustomCursor").then((m) => m.CustomCursor),
  {
    ssr: false,
  },
);

const LenisProvider = dynamic(
  () => import("./LenisProvider").then((m) => m.LenisProvider),
  {
    ssr: false,
  },
);

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
