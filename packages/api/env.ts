/* eslint-disable turbo/no-undeclared-env-vars */
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    MESSAGING_SERVICE_URL: z.string(),
    MESSAGING_SECRET_KEY: z.string(),
    // AWS S3
    AWS_S3_ACCESS_KEY_ID: z.string().min(10),
    AWS_S3_REGION: z.string().min(2),
    AWS_S3_BUCKET_NAME: z.string().min(2),
    AWS_S3_SECRET_ACCESS_KEY: z.string().min(1),
  },
  client: {},
  runtimeEnv: {
    MESSAGING_SERVICE_URL: process.env.MESSAGING_SERVICE_URL,
    MESSAGING_SECRET_KEY: process.env.MESSAGING_SECRET_KEY,
    // AWS S3
    AWS_S3_ACCESS_KEY_ID: process.env.AWS_S3_ACCESS_KEY_ID,
    AWS_S3_REGION: process.env.AWS_S3_REGION,
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
    AWS_S3_SECRET_ACCESS_KEY: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
  //experimental__runtimeEnv: {},
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
