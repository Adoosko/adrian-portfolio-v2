"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "next-intl";
import { useState, useTransition } from "react";

const languages = [
  { code: "en", name: "EN", flag: "🇺🇸" },
  { code: "cs", name: "CS", flag: "🇨🇿" },
  { code: "sk", name: "SK", flag: "🇸🇰" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={`
          flex items-center space-x-2 px-3 py-2 
          bg-background/80 backdrop-blur-sm
          border border-border/50 rounded-lg
          hover:bg-muted/50 hover:border-border
          transition-all duration-300
          ${isPending ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-sm">{currentLanguage.flag}</span>
        <span className="text-sm font-medium">{currentLanguage.name}</span>
        {isPending && (
          <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && !isPending && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50"
          >
            {languages.map((language) => (
              <motion.button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`
                  w-full flex items-center space-x-2 px-3 py-2 text-left 
                  hover:bg-muted/50 transition-colors
                  ${language.code === locale ? 'bg-primary/10 text-primary' : ''}
                `}
                whileHover={{ x: 2 }}
              >
                <span className="text-sm">{language.flag}</span>
                <span className="text-sm font-medium">{language.name}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
