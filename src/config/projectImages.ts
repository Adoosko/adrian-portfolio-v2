// config/projectImages.ts
export const projectImages = {
    glisten: '/optimized/glisten.webp',
    naformu: '/optimized/naformu-white.webp',
    redefine: '/optimized/redefine.webp',
    chlebicky: '/optimized/chlebicky.webp',
    kta: '/optimized/kta.webp',
    portfolio: '/optimized/portfolio.webp',
  } as const;
  

  // Univerzálny blur placeholder generator
export const generateBlurDataURL = (imageUrl: string): string => {
  const baseUrl = 'https://api.pixelated.dev/blur';
  return `${baseUrl}?url=${encodeURIComponent(imageUrl)}&size=8&quality=10`;
};
  export type ProjectImageKey = keyof typeof projectImages;
  