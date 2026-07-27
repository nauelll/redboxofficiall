import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.shopee.co.id" },
      { protocol: "https", hostname: "**.shopeestatic.com" },
      { protocol: "https", hostname: "down-id.img.susercontent.com" },
      { protocol: "https", hostname: "**.tokopedia.net" },
      { protocol: "https", hostname: "**.lazada.co.id" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
