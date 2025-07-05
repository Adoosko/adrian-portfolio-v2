"use client";

import CookieConsent from "react-cookie-consent";

const CookieConsentComponent = () => {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Súhlasím"
      cookieName="adrianfinik-cookie-consent"
      style={{ background: "#2B373B" }}
      buttonStyle={{ color: "#FFFFFF", background: "#4CAF50", fontSize: "13px", borderRadius: "5px" }}
      expires={150}
    >
      Táto webová stránka používa súbory cookie na zlepšenie používateľského zážitku.
    </CookieConsent>
  );
};

export default CookieConsentComponent;