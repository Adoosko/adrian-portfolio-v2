// next.config.ts
import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  compress: true,
  poweredByHeader: false,
  
  experimental: {
    ppr: 'incremental',
    useCache: true, // Pridajte tento flag
    // 🔥 Client-side optimalizácie
    clientSegmentCache: true,
    browserDebugInfoInTerminal: true,
    
    // 🔥 Developer experience
    devtoolSegmentExplorer: true,
    
    // 🔥 Global 404 handling
    globalNotFound: true,
    
    // 🔥 Turbopack optimalizácie
    turbopackPersistentCaching: true,
    
    // 🔥 Bundle optimalizácie
    optimizeCss: true,
   
    
    // 🔥 Render stratégie
    reactCompiler: true,
    
    // 🔥 Memory optimalizácie
    memoryBasedWorkersCount: true,
  },
  
  // Webpack s advanced optimalizáciami
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        maxAsyncRequests: 25,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
          },
          framerMotion: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            priority: 20,
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            priority: 30,
          },
        },
      };
    }
    
    // Fallback pre experimental features
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    return config;
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
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
