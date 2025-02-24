import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui", "@repo/auth", "@repo/validators", "@repo/db"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "github.com" },
      {
        protocol: "https",
        hostname: "cdn.discolaire.com",
      },
      {
        protocol: "https",
        hostname: "cdn-public.discolaire.com",
      },
      {
        protocol: "https",
        hostname: "discolaire-public.s3.eu-central-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
