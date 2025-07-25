import { MetadataRoute } from 'next';

const URL = 'https://adrianfinik.sk';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['en', 'cs', 'sk'];

  const pages = locales.map((locale) => {
    const url = locale === 'sk' ? URL : `${URL}/${locale}`;
    return {
      url,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: locale === 'sk' ? 1.0 : 0.8,
    };
  });

  return [...pages];
}
