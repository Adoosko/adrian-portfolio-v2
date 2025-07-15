// src/components/ClientOnlyWrapper.tsx
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const CookieConsentComponent = dynamic(
  () => import('@/components/CookieConsent'),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function ClientOnlyWrapper() {
  return (
    <Suspense fallback={null}>
      <CookieConsentComponent />
    </Suspense>
  );
}
