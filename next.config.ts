import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
// @ts-ignore: No types for @next/bundle-analyzer
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  compress: true,
};

const withNextIntl = createNextIntlPlugin();

const plugins = [
  withBundleAnalyzer({ enabled: process.env.BUNDLE_ANALYZE === 'both' }),
  withNextIntl,
];

/**
 * Compose plugins
 */
function composePlugins(config: any, plugins: any[]): any {
  return plugins.reduce((acc: any, plugin: any) => plugin(acc), config);
}

export default composePlugins(nextConfig, plugins);