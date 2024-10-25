import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets";
import { z } from "zod";

import { env as authEnv } from "@repo/auth/env";

export const env = createEnv({
  extends: [authEnv, vercel()],
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  /**
   * Specify your server-side environment variables schema here.
   * This way you can ensure the app isn't built with invalid env vars.
   */
  server: {
    AWS_S3_ACCESS_KEY_ID: z.string().min(10),
    AWS_S3_REGION: z.string().min(2),
    AWS_S3_BUCKET_NAME: z.string().min(2),
    AWS_S3_SECRET_ACCESS_KEY: z.string().min(1),
    SUPER_ADMIN_USERNAME: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),

    REPORT_API_KEY: z.string().min(1),
    DISCORD_WEBHOOK_URL: z.string().url(),
  },

  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().url(),
    NEXT_PUBLIC_PROSPECT_SERVICE_URL: z.string().url(),
    NEXT_PUBLIC_LIBRARY_SERVICE_URL: z.string().url(),
  },
  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    SUPER_ADMIN_USERNAME: process.env.SUPER_ADMIN_USERNAME,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_PROSPECT_SERVICE_URL:
      process.env.NEXT_PUBLIC_PROSPECT_SERVICE_URL,
    NEXT_PUBLIC_LIBRARY_SERVICE_URL:
      process.env.NEXT_PUBLIC_LIBRARY_SERVICE_URL,
    REPORT_API_KEY: process.env.REPORT_API_KEY,
    DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,

    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
    // AWS S3
    AWS_S3_ACCESS_KEY_ID: process.env.AWS_S3_ACCESS_KEY_ID,
    AWS_S3_REGION: process.env.AWS_S3_REGION,
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
    AWS_S3_SECRET_ACCESS_KEY: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
