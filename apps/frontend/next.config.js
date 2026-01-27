//import { createJiti } from "jiti";
import createNextIntlPlugin from "next-intl/plugin";

//const jiti = createJiti(import.meta.url);

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
//await jiti.import("./src/env");
//import "./src/env";

const isProd = process.env.NODE_ENV === "production";
const internalHost = process.env.TAURI_DEV_HOST || "localhost";

/** @type {import("next").NextConfig} */
const config = {
  output: "standalone",
  //cacheComponents: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@repo/api",
    "@repo/auth",
    "@repo/db",
    "@repo/transactional",
  ],

  images: {
    unoptimized: true,
    localPatterns: [
      {
        pathname: "/api/download/images/**",
      },
      {
        pathname: "/avatars/*",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.stickpng.com",
      },
      { protocol: "https", hostname: "github.com" },
      {
        protocol: "https",
        hostname: "cdn.discolaire.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
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
        hostname:
          "discolaire-avatar-public-uploads-f4a2c9.s3.eu-central-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname:
          "discolaire-images-public-uploads-g5v2c4o.s3.eu-central-1.amazonaws.com",
      },
    ],
  },
  assetPrefix: isProd ? undefined : `http://${internalHost}:3000`,

  typescript: { ignoreBuildErrors: true },
};
const withNextIntl = createNextIntlPlugin();
const withNextIntlConfig = withNextIntl(config);

export default withNextIntlConfig;
