"server-only";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { env } from "~/env";

import * as Minio from "minio";
const isLocal = env.NEXT_PUBLIC_DEPLOYMENT_ENV == "local";

const minioClient = new Minio.Client({
  endPoint: "localhost",
  port: 9310, //env.MINIO_PORT,
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
      metaData,
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
