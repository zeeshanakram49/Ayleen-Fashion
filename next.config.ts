import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  allowedDevOrigins: ["localhost", "127.0.0.1", "192.168.1.22"],
  images: {
    unoptimized: process.env.PLAYWRIGHT_TEST === "1",
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "admin.aylee.store",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/classic-2-columns", destination: "/shop", permanent: true },
      { source: "/#/shop", destination: "/shop", permanent: true },
      { source: "/#/cart", destination: "/cart", permanent: true },
      { source: "/#/wishlist", destination: "/wishlist", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
