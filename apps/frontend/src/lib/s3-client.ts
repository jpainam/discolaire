"server-only";

import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import * as Minio from "minio";

import { env } from "~/env";

const isLocal = env.NEXT_PUBLIC_DEPLOYMENT_ENV == "local";

function getHost(input: string): { host: string; port: string } {
  if (!input.startsWith("http")) {
    input = "http://" + input;
  }

  try {
    const url = new URL(input);
    return { host: url.hostname, port: url.port };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    throw new Error(
      `Invalid URL: ${input}. Please provide a valid URL for Minio.`,
    );
  }
}
const { host, port } = getHost(env.NEXT_PUBLIC_MINIO_URL);

export const minioClient = new Minio.Client({
  endPoint: host,
  port: Number(port),
  region: env.MINIO_REGION,
  useSSL: false, // set to False when using localhost
  accessKey: env.MINIO_ACCESS_KEY_ID,
  secretKey: env.MINIO_SECRET_ACCESS_KEY,
});

export const s3client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function runWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  concurrency: number,
): Promise<T[]> {
  const results: T[] = [];
  const queue = [...tasks];

  async function worker() {
    while (queue.length > 0) {
      const task = queue.shift();
      if (!task) return;
      try {
        const result = await task();
        results.push(result);
      } catch (e) {
        console.error("Task failed:", e);
        // You can push an error or null here if you want to preserve order
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);
  return results;
}

export async function deleteFile({
  bucket,
  key,
}: {
  bucket: string;
  key: string;
}) {
  if (isLocal) {
    await minioClient.removeObject(bucket, key);
  } else {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    await s3client.send(command);
  }
}

interface ListObjectsReturn {
  name: string;
  etag: string;
  size: number;
  lastModified: Date | null;
  key: string;
  location: string;
  bucket: string;
  prefix: string;
}
export async function listS3Objects({
  bucket,
  prefix,
}: {
  bucket: string;
  prefix?: string;
}): Promise<ListObjectsReturn[]> {
  const files: ListObjectsReturn[] = [];
  if (isLocal) {
    const objects = minioClient.listObjectsV2(bucket, prefix ?? "", true);
    objects.on("data", function (obj) {
      files.push({
        name: obj.name ?? "",
        etag: obj.etag ?? "",
        size: obj.size,
        lastModified: obj.lastModified ? new Date(obj.lastModified) : null,
        key: obj.name ?? "",
        location: `${env.NEXT_PUBLIC_MINIO_URL}/${bucket}/${obj.name}`,
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
    });
    const response = await s3client.send(command);
    if (response.Contents) {
      for (const obj of response.Contents) {
        files.push({
          name: obj.Key ?? "",
          etag: obj.ETag ?? "",
          size: obj.Size ?? 0,
          lastModified: obj.LastModified ?? new Date(),
          key: obj.Key ?? "",
          location: `https://${env.AWS_REGION}.amazonaws.com/${bucket}/${obj.Key}`,
          bucket: bucket,
          prefix: prefix ?? "",
        });
      }
    }
    return files;
  }
}
