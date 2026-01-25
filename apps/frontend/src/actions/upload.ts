"use server";

import { cookies } from "next/headers";
import { PutObjectCommand } from "@aws-sdk/client-s3";

import { getSession } from "~/auth/server";
import { env } from "~/env";
import { getRequestBaseUrl } from "~/lib/base-url.server";
import { minioClient, runWithConcurrency, s3client } from "~/lib/s3-client";

const isLocal = env.NEXT_PUBLIC_DEPLOYMENT_ENV == "local";
export async function downloadFileFromAws(key: string): Promise<string> {
  try {
    const session = await getSession();
    if (!session) {
      throw new Error("Unauthorized");
    }
    const baseUrl = await getRequestBaseUrl();
    const response = await fetch(
      `${baseUrl}/api/upload?key=${key}`,
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

export async function handleDeleteAvatar(
  key: string,
  profile: "student" | "staff" | "contact",
) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const baseUrl = await getRequestBaseUrl();
  const url = new URL("/api/upload/avatars", baseUrl);
  url.searchParams.set("filename", key);
  url.searchParams.set("profile", profile);

  const response = await fetch(url.toString(), {
    method: "DELETE",
    headers: {
      cookie: (await cookies()).toString(),
    },
  });

  if (!response.ok) throw new Error(await response.text());
  return { success: true };
}
export async function handleUploadAvatar(
  file: File,
  id: string,
  profile: "student" | "staff" | "contact",
) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const formData = new FormData();
  formData.append("file", file, file.name);
  const baseUrl = await getRequestBaseUrl();
  const url = new URL("/api/upload/avatars", baseUrl);
  url.searchParams.set("id", id);
  url.searchParams.set("profile", profile);

  const response = await fetch(url.toString(), {
    method: "POST",
    body: formData,
    headers: {
      cookie: (await cookies()).toString(),
    },
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Upload failed");
  }

  return { success: true };
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
