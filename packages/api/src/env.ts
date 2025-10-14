import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string(),
    MESSAGING_SERVICE_URL: z.string(),
    MESSAGING_SECRET_KEY: z.string(),
    // AWS S3
    S3_ACCESS_KEY_ID: z.string().min(10),
    S3_REGION: z.string().min(2),
    S3_BUCKET_NAME: z.string().min(2),
    S3_SECRET_ACCESS_KEY: z.string().min(1),
    REDIS_URL: z.string().min(1),
    UNKEY_ROOT_KEY: z.string().optional(),
    AUTH_SECRET: z.string().min(1),
    DISCOLAIRE_API_KEY: z.string().min(1),
    S3_AVATAR_BUCKET_NAME: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_MINIO_URL: z.string().min(1).url(),
    NEXT_PUBLIC_BASE_URL: z.string().min(1).url(),

    NEXT_PUBLIC_DEPLOYMENT_ENV: z.enum(["local", "cloud"]),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DISCOLAIRE_API_KEY: process.env.DISCOLAIRE_API_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    S3_AVATAR_BUCKET_NAME: process.env.S3_AVATAR_BUCKET_NAME,
    MESSAGING_SERVICE_URL: process.env.MESSAGING_SERVICE_URL,
    NEXT_PUBLIC_MINIO_URL: process.env.NEXT_PUBLIC_MINIO_URL,
    MESSAGING_SECRET_KEY: process.env.MESSAGING_SECRET_KEY,
    REDIS_URL: process.env.REDIS_URL,
    NEXT_PUBLIC_DEPLOYMENT_ENV: process.env.NEXT_PUBLIC_DEPLOYMENT_ENV,
    UNKEY_ROOT_KEY: process.env.UNKEY_ROOT_KEY,
    AUTH_SECRET: process.env.AUTH_SECRET,

    // AWS S3
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
    S3_REGION: process.env.S3_REGION,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
  },
  //experimental__runtimeEnv: {},
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
