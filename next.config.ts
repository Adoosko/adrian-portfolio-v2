import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
  compress: false,
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);