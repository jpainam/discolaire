// app/api/download/images/[key]/route.ts

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "~/env";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key } = await params;

  const isLocal = env.NEXT_PUBLIC_DEPLOYMENT_ENV === "local";
  const encodedKey = encodeURIComponent(key.join("/"));

  const s3Url = isLocal
    ? `${env.NEXT_PUBLIC_MINIO_URL}/${env.S3_IMAGE_BUCKET_NAME}/${encodedKey}`
    : `https://${env.S3_IMAGE_BUCKET_NAME}.s3.eu-central-1.amazonaws.com/${encodedKey}`;

  try {
    const response = await fetch(s3Url);
    const contentType = response.headers.get("content-type") ?? "";

    if (!response.ok || !contentType.startsWith("image/")) {
      return NextResponse.json(
        { error: "Image not found or invalid format" },
        { status: 404 }
      );
    }

    const buffer = await response.arrayBuffer();

    return new NextResponse(Buffer.from(buffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": response.headers.get("content-length") ?? "",
      },
    });
  } catch (error) {
    console.error("Image fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}
