/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextRequest } from "next/server";
import { DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

import { getSession } from "~/auth/server";
import { env } from "~/env";
import { s3client } from "~/lib/s3-client";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { destination, contentType, bucket, key } = await request.json();
  if (typeof destination !== "string" || destination.length === 0) {
    return Response.json(
      { error: "Invalid dest " + destination },
      { status: 400 },
    );
  }
  const fileKey = key ? `${destination}/${key}` : `${destination}/${uuidv4()}`;
  try {
    const { url, fields } = await createPresignedPost(s3client, {
      Bucket: bucket ?? env.S3_BUCKET_NAME,
      Key: fileKey,
      Conditions: [
        ["content-length-range", 0, 10485760], // up to 10 MB
        ["starts-with", "$Content-Type", contentType],
      ],
      Fields: {
        //acl: "public-read",
        "Content-Type": contentType,
      },
      Expires: 600, // Seconds before the presigned post expires. 3600 by default.
    });

    return Response.json({ url, fields });
  } catch (error: unknown) {
    return Response.json({ error: (error as Error).message });
  }
}

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ key: string }> },
) {
  const params = await props.params;
  const searchParams = request.nextUrl.searchParams;
  const key = searchParams.get("key") ?? params.key;

  if (!key) {
    throw new Error("File not found");
  }
  const bucket = env.S3_BUCKET_NAME;
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  const signedUrl = await getSignedUrl(s3client, command, { expiresIn: 3600 });
  return Response.json(signedUrl);
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ key: string }> },
) {
  const params = await props.params;
  const searchParams = request.nextUrl.searchParams;
  const key = searchParams.get("key") ?? params.key;

  if (!key) {
    throw new Error("File not found");
  }
  const bucket = env.S3_BUCKET_NAME;

  const deleteCommand = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  await s3client.send(deleteCommand);
  //console.log("File deleted successfully", response);
  return Response.json({ message: "File deleted successfully" });
}
