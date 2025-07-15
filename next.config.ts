// next.config.ts
import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
// @ts-ignore: No types for @next/bundle-analyzer
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
 
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
