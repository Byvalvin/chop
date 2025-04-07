/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '*',
          pathname: '/**',  // This allows any path under example.com
        },
      ],
    },
  };
  
  export default nextConfig;
  