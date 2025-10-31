/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false, // prevent automatic trailing slash redirects
  async redirects() {
    return [
      // Example: redirect old route to new route safely
      // Make sure source and destination do not loop
      // {
      //   source: '/old-path',
      //   destination: '/new-path',
      //   permanent: true,
      // },
    ];
  },
};

export default nextConfig;
