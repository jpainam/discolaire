import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { lookup } from "mime-types";
import * as Minio from "minio";

import { env } from "../env";

const isLocal = env.NEXT_PUBLIC_DEPLOYMENT_ENV == "local";

function getHost(input: string): string {
  if (!input.startsWith("http")) {
    input = "http://" + input;
  }

  try {
    const url = new URL(input);
    return url.hostname;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return input.split(":")[0] ?? "localhost"; // fallback
  }
}

export const minioClient = new Minio.Client({
  endPoint: getHost(env.NEXT_PUBLIC_MINIO_ENDPOINT),
  port: env.MINIO_PORT,
  useSSL: false, // set to False when using localhost
  accessKey: env.S3_ACCESS_KEY_ID,
  secretKey: env.S3_SECRET_ACCESS_KEY,
});

export const s3client = new S3Client({
  region: env.S3_REGION,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
});

export async function listS3Objects({
  bucket,
  prefix,
  startAfter,
}: {
  bucket: string;
  startAfter?: string;
  prefix?: string;
}): Promise<
  {
    name: string;
    etag: string;
    size: number;
    lastModified: Date | null;
    key: string;
    location: string;
    bucket: string;
    prefix: string;
  }[]
> {
  const files: {
    name: string;
    etag: string;
    size: number;
    lastModified: Date | null;
    key: string;
    mime: string | false;
    location: string;
    bucket: string;
    prefix: string;
  }[] = [];
  if (isLocal) {
    const objects = minioClient.listObjectsV2(
      bucket,
      prefix ?? "",
      true,
      startAfter,
    );
    objects.on("data", function (obj) {
      files.push({
        name: obj.name ?? "",
        etag: obj.etag ?? "",
        size: obj.size,
        mime: lookup(obj.name ?? "") ?? "application/octet-stream",
        lastModified: obj.lastModified ? new Date(obj.lastModified) : null,
        key: obj.name ?? "",
        location: `${env.NEXT_PUBLIC_MINIO_ENDPOINT}/${bucket}/${obj.name}`,
        bucket: bucket,
        prefix: prefix ?? "",
      });
    });
    objects.on("error", function (err) {
      console.log(err);
    });
    // Wait for the end event to resolve the promise
    // This is a workaround to ensure the function returns after all objects have been processed
    await new Promise((resolve) => {
      objects.on("end", function () {
        console.log("done");
        resolve(true);
      });
    });

    return files;
  } else {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      StartAfter: startAfter,
    });
    const response = await s3client.send(command);
    if (response.Contents) {
      for (const obj of response.Contents) {
        files.push({
          name: obj.Key ?? "",
          etag: obj.ETag ?? "",
          mime: lookup(obj.Key ?? "") ?? "application/octet-stream",
          size: obj.Size ?? 0,
          lastModified: obj.LastModified ?? new Date(),
          key: obj.Key ?? "",
          location: `https://${env.S3_REGION}.amazonaws.com/${bucket}/${obj.Key}`,
          bucket: bucket,
          prefix: prefix ?? "",
        });
      }
    }
    return files;
  }
}
