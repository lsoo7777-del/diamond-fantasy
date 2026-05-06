/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow ESPN API to be proxied from server-side routes
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ];
  },
};

export default nextConfig;
