import { MetadataRoute } from 'next';

const URL = 'https://adrianfinik.sk';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${URL}/sitemap.xml`,
  };
}