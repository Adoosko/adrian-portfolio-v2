"use client";

import { useTranslations } from "next-intl";
import CookieConsent from "react-cookie-consent";

const CookieConsentComponent = () => {
  const t = useTranslations("CookieConsent");

  return (
    <CookieConsent
      location="bottom"
      buttonText={t('buttonText')}
      cookieName="adrianfinik-cookie-consent"
      expires={150}
      containerClasses="!bg-background/80 !backdrop-blur-xl !border-t !border-border !p-4 !flex !items-center !justify-center"
      contentClasses="text-muted-foreground text-sm"
      buttonClasses="!bg-primary !text-primary-foreground !rounded-md !px-4 !py-2 !text-sm !font-medium"
    >
      {t('message')}
    </CookieConsent>
  );
};

export default CookieConsentComponent;