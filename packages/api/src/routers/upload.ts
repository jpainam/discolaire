import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { env } from "../env";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const client = new S3Client({
  region: env.S3_REGION,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
});

export const uploadRouter = createTRPCRouter({
  getSignedUrl: protectedProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      const bucket = env.S3_BUCKET_NAME;
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: input.key,
      });
      return getSignedUrl(client, command, {
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
      const { url, fields } = await createPresignedPost(client, {
        Bucket: env.S3_BUCKET_NAME,
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

  matchedIds: protectedProcedure
    .input(
      z.object({
        entityType: z.enum(["staff", "contact", "student"]),
        entityIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.entityType === "staff") {
        const data = await ctx.db.staff.findMany({
          where: {
            lastName: {
              in: input.entityIds,
            },
          },
        });
        return data.map((staff) => ({
          id: staff.id,
          name: `${staff.firstName} ${staff.lastName}`,
        }));
      } else if (input.entityType === "contact") {
        const data = await ctx.db.contact.findMany({
          where: {
            lastName: {
              in: input.entityIds,
            },
          },
        });
        return data.map((contact) => ({
          id: contact.id,
          name: `${contact.firstName} ${contact.lastName}`,
        }));
      }
      const data = await ctx.db.student.findMany({
        where: {
          registrationNumber: {
            in: input.entityIds,
          },
        },
      });
      return data.map((student) => ({
        id: student.id,
        name: student.registrationNumber,
      }));
    }),
});
