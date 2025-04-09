/* eslint-disable @typescript-eslint/no-unsafe-call */
// pages/api/download/[...path].ts
import { GetObjectCommand } from "@aws-sdk/client-s3";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env";
import { s3client } from "~/lib/s3-client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { path: filePathArray } = req.query; // file path parts as an array
  if (!filePathArray || !Array.isArray(filePathArray)) {
    return res.status(400).json({ error: "Invalid file path" });
  }
  const key = filePathArray.join("/");

  try {
    const command = new GetObjectCommand({
      Bucket: env.S3_AVATAR_BUCKET_NAME,
      Key: key,
    });
    const data = await s3client.send(command);
    // Pipe the stream to the response if available
    // @ts-expect-error TODO: Fix type error
    if (data.Body && typeof data.Body.pipe === "function") {
      // Set content headers. You can determine the content type or set defaults.
      res.setHeader(
        "Content-Type",
        data.ContentType ?? "application/octet-stream",
      );
      // @ts-expect-error TODO: Fix type error
      data.Body.pipe(res);
    } else {
      return res.status(500).json({ error: "No stream available" });
    }
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}
