"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";

import { getSession } from "~/auth/server";
import { env } from "~/env";
import { minioClient, runWithConcurrency, s3client } from "~/lib/s3-client";

const isLocal = env.NEXT_PUBLIC_DEPLOYMENT_ENV == "local";
export async function downloadFileFromAws(key: string): Promise<string> {
  try {
    const session = await getSession();
    if (!session) {
      throw new Error("Unauthorized");
    }
    const response = await fetch(
      `${env.NEXT_PUBLIC_BASE_URL}/api/upload?key=${key}`,
    );
    if (!response.ok) {
      throw new Error("Failed to download file");
    }
    const signedUrl = (await response.json()) as string;
    return signedUrl;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function handleDeleteAvatar(key: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  try {
    const response = await fetch(`/api/upload/avatars?filename=${key}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("An error occured");
    }
    return {
      success: true,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function handleUploadAvatar(
  file: File,
  id: string,
  profile: string,
) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  try {
    const formData = new FormData();
    formData.append("file", file, file.name);
    const response = await fetch(
      `/api/upload/avatars?id=${id}&profile=${profile}`,
      {
        method: "POST",
        body: formData,
      },
    );
    if (!response.ok) {
      throw new Error("An error occured");
    }
    return {
      success: true,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getBucket(type: "avatar" | "image" | "document") {
  await new Promise((resolve) => setTimeout(resolve, 1));
  if (type == "avatar") {
    return env.S3_AVATAR_BUCKET_NAME;
  } else {
    return env.S3_DOCUMENT_BUCKET_NAME;
  }
}

/**
 *
 * @param param0 destination has buckename and file name e.g. documents/abc.txt
 */
export async function uploadFile({
  file,
  destination,
  bucket,
}: {
  file: File;
  bucket: string;
  destination: string;
}) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  // Use MINIO to upload the file if running locally
  if (isLocal) {
    // Check if the bucket exists If it doesn't, create it
    const exists = await minioClient.bucketExists(bucket);
    if (!exists) {
      await minioClient.makeBucket(bucket, "us-east-1"); // any region
      console.log("Bucket " + bucket + ' created in "us-east-1".');
    }
    // Set the object metadata
    const metaData = {
      "Content-Type": file.type,
    };

    await minioClient.putObject(
      bucket,
      destination,
      Buffer.from(await file.arrayBuffer()),
      file.size,
      metaData,
    );
    return {
      key: destination,
      fullPath: `https://${env.NEXT_PUBLIC_MINIO_URL}/${bucket}/${destination}`,
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
}

export async function uploadFiles({
  files,
  destinations,
  bucket,
}: {
  files: File[];
  destinations: string[];
  bucket: string;
}) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
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
