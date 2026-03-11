/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@servermg/shared-types'],
  output: 'standalone',
};

module.exports = nextConfig;
