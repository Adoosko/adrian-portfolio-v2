// next.config.ts
import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
// @ts-ignore: No types for @next/bundle-analyzer
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  // Basic optimizations
  compress: true,
  poweredByHeader: false,
  
  // Experimental features for maximum performance
  experimental: {
    // Enable PPR incrementally - requires Next.js 15+
    ppr: 'incremental',
    
   
    // Bundle analysis optimizations
    optimizePackageImports: ['lucide-react', 'date-fns', 'lodash'],
  },
  
  // Image optimizations
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  
  // Headers pre performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Redirects pre SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  

 
  

  
  // ESLint pre build
  eslint: {
    ignoreDuringBuilds: false,
  },
};

const withNextIntl = createNextIntlPlugin();

const plugins = [
  withBundleAnalyzer({ 
    enabled: process.env.BUNDLE_ANALYZE === 'both',
    // Dodatočné bundle analyzer optimalizácie
    openAnalyzer: false,
  }),
  withNextIntl,
];

/**
 * Compose plugins s type safety
 */
function composePlugins(config: NextConfig, plugins: any[]): NextConfig {
  return plugins.reduce((acc: NextConfig, plugin: any) => plugin(acc), config);
}

export default composePlugins(nextConfig, plugins);
