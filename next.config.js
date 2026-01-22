/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // ✅ IMPORTANT: remove `output: "export"` if you want /api (or any server features)

  images: {
    // Easiest path on Workers: don't use Next's built-in image optimizer unless you configure it.
    // You can remove this later if you set up image optimization properly.
    unoptimized: true,

    domains: ["lh3.googleusercontent.com", "vercel.com"],
  },

  async redirects() {
    return [
      {
        source: "/github",
        destination: "https://github.com/steven-tey/precedent",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
