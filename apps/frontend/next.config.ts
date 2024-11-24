import type { NextConfig } from "next";

import "./src/env";

const config = {
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@repo/api",
    "@repo/auth",
    "@repo/db",
    "@repo/hooks",
    "@repo/i18n",
    "@repo/lib",
    "@repo/jobs",
    "@repo/reports",
    "@repo/transactional",
    "@repo/ui",
    "@repo/validators",
  ],

  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "github.com", port: "" },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },

      {
        protocol: "https",
        hostname: "discolaire-public.s3.eu-central-1.amazonaws.com",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        child_process: false,
        path: false,
        net: false,
        worker_threads: false,
        crypto: false,
        fs: false, // Add any other Node.js modules as necessary
      };
    }
    return config;
  },
} satisfies NextConfig;

export default config;
