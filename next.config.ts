// next.config.ts - aktualizované pre Next.js 15.4+ stable
import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // Image optimalizácie
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
 
  
  
  
  
  // Experimental features len pre pokročilé use cases
  experimental: {
    // ❌ NEPOTREBUJETE pre statický portfolio projekt
    // ppr: 'incremental',
    // dynamicIO: true,
    // useCache: true,
    
    // ✅ STABLE optimalizácie
    optimizeCss: true,
    optimizePackageImports: [
      'motion/react',
      'lucide-react',
      'next-intl'
    ],
    
  
  },
  
  // Headers pre statický obsah
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
  
  // Webpack optimalizácie s Turbopack
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
          },
          motion: {
            test: /[\\/]node_modules[\\/]motion/,
            name: 'motion',
            priority: 20,
          },
        },
      };
    }
    return config;
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
