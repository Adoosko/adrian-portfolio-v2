// lib/fonts.ts alebo priamo v layout.tsx
import localFont from 'next/font/local';

export const boska = localFont({
  src: '../../public/fonts/boska/Boska-Variable.woff2',
  variable: '--font-boska',
  display: 'swap',
  preload: true,
});
