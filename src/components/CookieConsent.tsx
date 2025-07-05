"use client";

import { Cookie } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import CookieConsent from "react-cookie-consent";

const CookieConsentComponent = () => {
  const t = useTranslations("CookieConsent");
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBanner(true);
    }, 10000); // 10-second delay

    return () => clearTimeout(timer);
  }, []);

  if (!showBanner) {
    return null;
  }

  return (
    <CookieConsent
      location="bottom"
      buttonText={t('buttonText')}
      cookieName="adrianfinik-cookie-consent"
      expires={150}
      containerClasses="!bg-background/80 !backdrop-blur-xl !border-t !border-border !p-4 !flex !items-center !justify-center"
      contentClasses="text-muted-foreground text-sm flex items-center"
      buttonClasses="!bg-primary !text-primary-foreground !rounded-md !px-4 !py-2 !text-sm !font-medium"
    >
      <Cookie className="mr-2 h-4 w-4" />
      {t('message')}
    </CookieConsent>
  );
};

export default CookieConsentComponent;