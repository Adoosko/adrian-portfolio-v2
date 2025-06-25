// lib/fonts.ts alebo priamo v layout.tsx
import localFont from 'next/font/local';

export const boska = localFont({
  src: [
    {
      path: '../../public/fonts/boska/Boska-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/boska/Boska-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/boska/Boska-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/boska/Boska-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-boska',
  display: 'swap',
  preload: true,
});
