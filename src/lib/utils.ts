import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// src/utils/blurPlaceholder.ts
export const createSVGBlur = (color = '#e5e7eb'): string => {
  const svg = `
    <svg width="400" height="225" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="blur" x="0" y="0">
          <feGaussianBlur in="SourceGraphic" stdDeviation="15"/>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="${color}" filter="url(#blur)"/>
    </svg>
  `;
  
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
};

// Rôzne farebné varianty
export const BLUR_PLACEHOLDERS = {
  gray: createSVGBlur('#e5e7eb'),
  blue: createSVGBlur('#dbeafe'),
  purple: createSVGBlur('#f3e8ff'),
  green: createSVGBlur('#dcfce7'),
  neutral: createSVGBlur('#f5f5f5'),
} as const;


