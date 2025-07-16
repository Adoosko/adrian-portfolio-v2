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
  
  // 🔥 KRITICKÉ OPTIMALIZÁCIE
  experimental: {
   
    optimizeCss: true,
    optimizePackageImports: [
      'framer-motion',
      'lucide-react',
      'next-intl'
    ],
  },
  
  // Bundle optimization
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
          framerMotion: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            priority: 20,
          },
        },
      };
    }
    return config;
  },
};

const withNextIntl = createNextIntlPlugin();
const plugins = [withNextIntl];

function composePlugins(config: NextConfig, plugins: any[]): NextConfig {
  return plugins.reduce((acc: NextConfig, plugin: any) => plugin(acc), config);
}

export default composePlugins(nextConfig, plugins);
