import { z } from "zod";

import { listS3Objects } from "../services/s3-client";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const photoRouter = createTRPCRouter({
  listObjects: protectedProcedure
    .input(
      z.object({
        startAfter: z.string().optional(),
        prefix: z.string(),
        bucket: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return listS3Objects({
        bucket: input.bucket,
        prefix: input.prefix,
        startAfter: input.startAfter,
      });
    }),
});
