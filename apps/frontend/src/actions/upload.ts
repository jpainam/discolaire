"use server";

import { getSession } from "~/auth/server";
import { env } from "~/env";

export async function downloadFileFromAws(key: string): Promise<string> {
  try {
    const session = await getSession();
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
  } catch (e) {
    console.error(e);
    throw e;
  }
}
