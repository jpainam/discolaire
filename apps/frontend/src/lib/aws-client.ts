import { S3Client } from "@aws-sdk/client-s3";
import { env } from "~/env";

const IS_LOCAL = env.IS_LOCAL === "true";
export const s3client = new S3Client({
  ...(!IS_LOCAL ? { endpoint: env.MINIO_ENDPOINT, forcePathStyle: true } : {}),
  region: env.S3_REGION,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
});
