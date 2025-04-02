import { GetObjectCommand } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { s3client } from "~/lib/aws-client";
import { env } from "../env";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const uploadRouter = createTRPCRouter({
  getSignedUrl: protectedProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      const bucket = env.AWS_S3_BUCKET_NAME;
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: input.key,
      });
      return getSignedUrl(s3client, command, {
        expiresIn: 3600,
      });
    }),
  createPresignedPost: protectedProcedure
    .input(
      z.object({
        destination: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const contentType = "application/json";
      const { url, fields } = await createPresignedPost(s3client, {
        Bucket: env.AWS_S3_BUCKET_NAME,
        Key: `${input.destination}/${uuidv4()}`,
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

      return {
        url,
        fields,
      };
    }),
});
