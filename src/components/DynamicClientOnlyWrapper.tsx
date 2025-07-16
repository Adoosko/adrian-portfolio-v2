'use client';

import dynamic from 'next/dynamic';

// Dynamický import s ssr: false je teraz bezpečne v klientskom komponente
const ClientOnlyWrapperProvider = dynamic(
  () => import('@/components/ClientOnlyWrapperProvider'),
  {
    loading: () => null,
    ssr: false,
  }
);

// Exportujeme komponent, ktorý môžeme použiť v serverových komponentoch
export function DynamicClientOnlyWrapper() {
  return <ClientOnlyWrapperProvider />;
}