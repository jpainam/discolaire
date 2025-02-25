import type { NextConfig } from "next";

import "./src/env";
const nextConfig: NextConfig = {
  reactStrictMode: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@repo/api",
    "@repo/ui",
    "@repo/auth",
    "@repo/validators",
    "@repo/db",
  ],
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

  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
