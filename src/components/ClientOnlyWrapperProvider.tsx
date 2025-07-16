// src/components/ClientOnlyWrapperProvider.tsx
'use client';

import dynamic from 'next/dynamic';

const ClientOnlyWrapper = dynamic(
  () => import('@/components/ClientOnlyWrapper'),
  {
    ssr: false,
    loading: () => null
  }
);

export default function ClientOnlyWrapperProvider() {
  return <ClientOnlyWrapper />;
}
