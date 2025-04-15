"server-only";
import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { env } from "~/env";

import * as Minio from "minio";
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

/**
 *
 * @param param0 destination has buckename and file name e.g. documents/abc.txt
 */
export const uploadFile = async ({
  file,
  destination,
  bucket,
}: {
  file: File;
  bucket: string;
  destination: string;
}) => {
  // Use MINIO to upload the file if running locally
  if (isLocal) {
    // Check if the bucket exists If it doesn't, create it
    const exists = await minioClient.bucketExists(bucket);
    if (exists) {
      console.log("Bucket " + bucket + " exists.");
    } else {
      await minioClient.makeBucket(bucket, "us-east-1"); // any region
      console.log("Bucket " + bucket + ' created in "us-east-1".');
    }
    // Set the object metadata
    const metaData = {
      "Content-Type": file.type,
    };

    // Upload the file with fPutObject If an object with the same name exists,  it is updated with new data

    await minioClient.putObject(
      bucket,
      destination,
      Buffer.from(await file.arrayBuffer()),
      file.size,
      metaData
    );
    return {
      key: destination,
      fullPath: `https://${env.NEXT_PUBLIC_MINIO_ENDPOINT}/${bucket}/${destination}`,
    };
  } else {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: destination,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
    });
    await s3client.send(command);
    return {
      key: destination,
      fullPath: `https://${env.S3_REGION}.amazonaws.com/${bucket}/${destination}`,
    };
  }
};

export async function uploadFiles({
  files,
  destinations,
  bucket,
}: {
  files: File[];
  destinations: string[];
  bucket: string;
}) {
  const tasks = files.map((file, index) => async () => {
    if (!destinations[index]) {
      throw new Error(`Destination for file ${index} is missing`);
    }
    return uploadFile({
      file,
      destination: destinations[index],
      bucket,
    });
  });
  const uploadResults = await runWithConcurrency(tasks, 5);
  return uploadResults;
}

async function runWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  concurrency: number
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
        location: `https://${env.NEXT_PUBLIC_MINIO_ENDPOINT}/${bucket}/${obj.name}`,
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
          location: `https://${env.S3_REGION}.amazonaws.com/${bucket}/${obj.Key}`,
          bucket: bucket,
          prefix: prefix ?? "",
        });
      }
    }
    return files;
  }
}
