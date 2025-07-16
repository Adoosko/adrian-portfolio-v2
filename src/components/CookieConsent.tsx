'use client';

import { Cookie, Settings, Shield, X } from 'lucide-react';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'motion/react';
import { useTranslations } from 'next-intl';
import {
  memo,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';

// Optimalizované typy pre 2025
interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

interface CookieConsentState {
  status: 'undecided' | 'accepted' | 'declined' | 'partial';
  preferences: CookiePreferences;
  timestamp: number;
  version: string;
}

// Konstanty pre optimalizáciu
const COOKIE_NAME = 'adrianfinik-cookie-consent-v2';
const COOKIE_VERSION = '2.0';
const SHOW_DELAY = 3000;
const COOKIE_EXPIRY = 365;

// Optimalizované animácie
const bannerVariants = {
  hidden: { 
    y: 100, 
    opacity: 0,
    scale: 0.95
  },
  visible: { 
    y: 0, 
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  exit: { 
    y: 100, 
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.3 }
  }
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

// Cookie utilities
const cookieUtils = {
  set: (value: CookieConsentState) => {
    if (typeof window !== 'undefined') {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY);
      document.cookie = `${COOKIE_NAME}=${JSON.stringify(value)}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict; Secure`;
    }
  },
  
  get: (): CookieConsentState | null => {
    if (typeof window === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    const consentCookie = cookies.find(cookie => 
      cookie.trim().startsWith(`${COOKIE_NAME}=`)
    );
    
    if (!consentCookie) return null;
    
    try {
      const value = consentCookie.split('=')[1];
      return JSON.parse(decodeURIComponent(value));
    } catch {
      return null;
    }
  },
  
  clear: () => {
    if (typeof window !== 'undefined') {
      document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  }
};

// Memoizovaný preferences modal s m komponentom
const CookiePreferencesModal = memo<{
  isOpen: boolean;
  onClose: () => void;
  preferences: CookiePreferences;
  onPreferencesChange: (preferences: CookiePreferences) => void;
  onSave: () => void;
  t: any;
}>(({ isOpen, onClose, preferences, onPreferencesChange, onSave, t }) => {
  const handleToggle = useCallback((key: keyof CookiePreferences) => {
    if (key === 'necessary') return;
    
    onPreferencesChange({
      ...preferences,
      [key]: !preferences[key]
    });
  }, [preferences, onPreferencesChange]);

  if (!isOpen) return null;

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <m.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-background border border-border rounded-lg p-6 max-w-md w-full m-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            {t('preferencesModal.title')}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          {Object.entries(preferences).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium">{t(`preferencesModal.${key}.title`)}</label>
                <p className="text-xs text-muted-foreground">{t(`preferencesModal.${key}.description`)}</p>
              </div>
              <div className="ml-4">
                <button
                  onClick={() => handleToggle(key as keyof CookiePreferences)}
                  disabled={key === 'necessary'}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-primary' : 'bg-muted'
                  } ${key === 'necessary' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onSave}
            className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {t('preferencesModal.save')}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors"
          >
            {t('preferencesModal.cancel')}
          </button>
        </div>
      </m.div>
    </m.div>
  );
});

CookiePreferencesModal.displayName = 'CookiePreferencesModal';

// Hlavný optimalizovaný komponent s m komponentom
const CookieConsentComponent = memo(() => {
  const t = useTranslations('CookieConsent');
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [consentState, setConsentState] = useState<CookieConsentState | null>(null);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  });

  useEffect(() => {
    const existingConsent = cookieUtils.get();
    
    if (existingConsent) {
      setConsentState(existingConsent);
      setPreferences(existingConsent.preferences);
    } else {
      const timer = setTimeout(() => {
        startTransition(() => {
          setShowBanner(true);
        });
      }, SHOW_DELAY);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = useCallback(() => {
    const newState: CookieConsentState = {
      status: 'accepted',
      preferences: {
        necessary: true,
        analytics: true,
        marketing: true,
        preferences: true
      },
      timestamp: Date.now(),
      version: COOKIE_VERSION
    };
    
    cookieUtils.set(newState);
    setConsentState(newState);
    setShowBanner(false);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cookieConsentAccepted', { detail: newState }));
    }
  }, []);

  const handleDeclineAll = useCallback(() => {
    const newState: CookieConsentState = {
      status: 'declined',
      preferences: {
        necessary: true,
        analytics: false,
        marketing: false,
        preferences: false
      },
      timestamp: Date.now(),
      version: COOKIE_VERSION
    };
    
    cookieUtils.set(newState);
    setConsentState(newState);
    setShowBanner(false);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cookieConsentDeclined', { detail: newState }));
    }
  }, []);

  const handleSavePreferences = useCallback(() => {
    const newState: CookieConsentState = {
      status: 'partial',
      preferences,
      timestamp: Date.now(),
      version: COOKIE_VERSION
    };
    
    cookieUtils.set(newState);
    setConsentState(newState);
    setShowBanner(false);
    setShowPreferences(false);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cookieConsentPartial', { detail: newState }));
    }
  }, [preferences]);

  const handleShowPreferences = useCallback(() => {
    setShowPreferences(true);
  }, []);

  const handleClosePreferences = useCallback(() => {
    setShowPreferences(false);
  }, []);

  const handlePreferencesChange = useCallback((newPreferences: CookiePreferences) => {
    setPreferences(newPreferences);
  }, []);

  const buttons = useMemo(() => [
    {
      id: 'acceptAll',
      text: t('acceptAll'),
      onClick: handleAcceptAll,
      variant: 'primary' as const,
      icon: null
    },
    {
      id: 'preferences',
      text: t('preferences'),
      onClick: handleShowPreferences,
      variant: 'outline' as const,
      icon: Settings
    },
    {
      id: 'declineAll',
      text: t('declineAll'),
      onClick: handleDeclineAll,
      variant: 'ghost' as const,
      icon: null
    }
  ], [t, handleAcceptAll, handleShowPreferences, handleDeclineAll]);

  if (consentState || !showBanner) {
    return (
      <AnimatePresence>
        {showPreferences && (
          <CookiePreferencesModal
            isOpen={showPreferences}
            onClose={handleClosePreferences}
            preferences={preferences}
            onPreferencesChange={handlePreferencesChange}
            onSave={handleSavePreferences}
            t={t}
          />
        )}
      </AnimatePresence>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {showBanner && (
          <m.div
          //@ts-ignore
            variants={bannerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-0 left-0 right-0 z-[9998] bg-background/95 backdrop-blur-xl border-t border-border shadow-lg"
          >
            <div className="max-w-7xl mx-auto p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Cookie className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-1">
                      {t('title')}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t('message')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {buttons.map((button) => {
                    const Icon = button.icon;
                    return (
                      <m.button
                        key={button.id}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={button.onClick}
                        className={`
                          flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium
                          transition-colors whitespace-nowrap
                          ${button.variant === 'primary' 
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                            : button.variant === 'outline'
                            ? 'border border-border hover:bg-muted'
                            : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                          }
                        `}
                      >
                        {Icon && <Icon className="h-4 w-4" />}
                        {button.text}
                      </m.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </m.div>
        )}

        <CookiePreferencesModal
          isOpen={showPreferences}
          onClose={handleClosePreferences}
          preferences={preferences}
          onPreferencesChange={handlePreferencesChange}
          onSave={handleSavePreferences}
          t={t}
        />
      </AnimatePresence>
    </LazyMotion>
  );
});

CookieConsentComponent.displayName = 'CookieConsentComponent';

export default CookieConsentComponent;
