"use server";

import { auth } from "@repo/auth";

import { env } from "~/env";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function deleteFileFromAws(key: string): Promise<any> {
  const session = await auth();
  if (!session) {
    throw new Error("Failed to authenticate user");
  }
  const response = await fetch(
    `${env.NEXT_PUBLIC_BASE_URL}/api/upload?key=${key}`,
    {
      method: "DELETE",
    },
  );
  if (!response.ok) {
    throw new Error("Failed to delete file");
  }
  return response.json();
}

export async function downloadFileFromAws(key: string): Promise<string> {
  const session = await auth();
  if (!session) {
    throw new Error("Failed to authenticate user");
  }
  const response = await fetch(
    `${env.NEXT_PUBLIC_BASE_URL}/api/upload?key=${key}`,
  );
  if (!response.ok) {
    throw new Error("Failed to download file");
  }
  const signedUrl = (await response.json()) as string;
  return signedUrl;
}
