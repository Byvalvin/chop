/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      },
    ],
  },
  // No 'pwa' key here
};

const pwaOptions = {
  dest: 'public',
  register: true,
  skipWaiting: true,
  // disable: process.env.NODE_ENV !== 'production',
  disable:false,
  buildExcludes: [/middleware-manifest.json$/], // optional workaround for some multiple SW calls
};

export default withPWA(pwaOptions)(nextConfig);
