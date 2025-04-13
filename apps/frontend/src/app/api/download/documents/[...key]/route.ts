/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/download/documents/[key]/route.ts

import { GetObjectCommand } from "@aws-sdk/client-s3";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { Readable } from "stream";
import { env } from "~/env";
import { minioClient, s3client } from "~/lib/s3-client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key } = await params;
  const objectKey = key.join("/");
  const isLocal = env.NEXT_PUBLIC_DEPLOYMENT_ENV === "local";

  try {
    if (isLocal) {
      // Use MinIO client
      const stream = await minioClient.getObject(
        env.S3_DOCUMENT_BUCKET_NAME,
        objectKey
      );
      const stat = await minioClient.statObject(
        env.S3_DOCUMENT_BUCKET_NAME,
        objectKey
      );
      const contentType =
        stat.metaData["content-type"] ?? "application/octet-stream";
      const contentLength = stat.size.toString();

      return new NextResponse(stream as any, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Length": contentLength,
          "Content-Disposition": `inline; filename="${key.at(-1)}"`,
        },
      });
    } else {
      // Use AWS S3 SDK
      const command = new GetObjectCommand({
        Bucket: env.S3_DOCUMENT_BUCKET_NAME,
        Key: objectKey,
      });
      const response = await s3client.send(command);

      const bodyStream = response.Body as Readable;
      const contentType = response.ContentType ?? "application/octet-stream";
      const contentLength = response.ContentLength?.toString() ?? "";

      return new NextResponse(bodyStream as any, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Length": contentLength,
          "Content-Disposition": `inline; filename="${key.at(-1)}"`,
        },
      });
    }
  } catch (error: any) {
    console.error("Document fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch document" },
      { status: error.code === "NoSuchKey" ? 404 : 500 }
    );
  }
}
