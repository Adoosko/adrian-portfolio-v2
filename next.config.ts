// next.config.ts - Final optimized version
import withBundleAnalyzer from '@next/bundle-analyzer';
import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // Image optimizations
  images: {
    formats: ['image/avif', 'image/webp'],
   
  },
  // Experimental features
  experimental: {
    ppr: 'incremental',
    useCache: true,
    optimizeCss: true,
    inlineCss:true,
   
  },

  


  
};

const withNextIntl = createNextIntlPlugin();

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(withNextIntl(nextConfig));
