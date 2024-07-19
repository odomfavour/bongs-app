/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // BASEURL: 'https://bongsapi.dpanalyticsolution.com/api/v1',
    BASEURL: 'https://devbongsapi.dpanalyticsolution.com/api/v1',
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
};

export default nextConfig;
