/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // BASEURL: 'https://bongsapi.dpanalyticsolution.com/api/v1',
    BASEURL: 'https://devbongsapi.dpanalyticsolution.com/api/v1',
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
  basePath: '/stagingv2',
  assetPrefix: 'https://stagingv2.dpanalyticsolution.com',
};

export default nextConfig;
