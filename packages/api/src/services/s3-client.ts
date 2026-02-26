import {
  HeadObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import { lookup } from "mime-types";
import * as Minio from "minio";

import { env } from "../env";

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
  useSSL: false, // set to False when using localhost
  accessKey: env.AWS_ACCESS_KEY_ID,
  secretKey: env.AWS_SECRET_ACCESS_KEY,
});

export const s3client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
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
    mime: string;
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
    mime: string;
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
      const m = lookup(obj.name ?? "");
      files.push({
        name: obj.name ?? "",
        etag: obj.etag ?? "",
        size: obj.size,
        mime: !m ? "application/octet-stream" : m,
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
      StartAfter: startAfter,
    });
    const response = await s3client.send(command);
    if (response.Contents) {
      for (const obj of response.Contents) {
        const m = lookup(obj.Key ?? "");
        files.push({
          name: obj.Key ?? "",
          etag: obj.ETag ?? "",
          mime: !m ? "application/octet-stream" : m,
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

export async function getObjectStat({
  bucket,
  key,
}: {
  bucket: string;
  key: string;
}) {
  if (isLocal) {
    const stat = await minioClient.statObject(bucket, key);

    return {
      exists: true,
      size: stat.size,
      etag: stat.etag,
      lastModified: stat.lastModified,
      contentType: stat.metaData["content-type"] as string | undefined,
      metadata: stat.metaData,
    };
  }
  const result = await s3client.send(
    new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );

  return {
    exists: true,
    size: result.ContentLength,
    contentType: result.ContentType,
    lastModified: result.LastModified,
    etag: result.ETag,
    metadata: result.Metadata,
  };
}
