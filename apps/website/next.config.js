/** @type {import('next').NextConfig} */

import { fileURLToPath } from "url";
//import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";
import createJiti from "jiti";

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
createJiti(fileURLToPath(import.meta.url))("./src/env");

/** @type {import("next").NextConfig} */
const nextConfig = {
  // webpack: (config, { isServer }) => {
  //   if (isServer) {
  //     config.plugins = [...config.plugins, new PrismaPlugin()];
  //   }

  //   return config;
  // },
  reactStrictMode: true,

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@repo/ui"],

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
    ],
  },
};

export default nextConfig;
