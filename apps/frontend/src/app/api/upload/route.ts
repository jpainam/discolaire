import type {NextRequest} from "next/server";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

import { env } from "~/env";

const client = new S3Client({
  region: env.AWS_S3_REGION,
  credentials: {
    accessKeyId: env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_S3_SECRET_ACCESS_KEY,
  },
});

export async function POST(request: Request) {
  const { filename, dest, contentType } = await request.json();
  if (typeof dest !== "string" || dest.length === 0) {
    return Response.json({ error: "Invalid dest " + dest }, { status: 400 });
  }
  try {
    const { url, fields } = await createPresignedPost(client, {
      Bucket: env.AWS_S3_BUCKET_NAME,
      Key: `${dest}/${uuidv4()}`,
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
  } catch (error: any) {
    return Response.json({ error: error.message });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } },
) {
  const searchParams = request.nextUrl.searchParams;
  const key = (searchParams.get("key")!) || params.key;
  if (!key) {
    return Response.json(
      { error: "A query/params key is required" },
      { status: 400 },
    );
  }
  const bucket = env.AWS_S3_BUCKET_NAME;
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
  return Response.json(signedUrl);
}
