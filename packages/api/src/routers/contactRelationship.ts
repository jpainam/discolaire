import type { TRPCRouterRecord } from "@trpc/server";

import { protectedProcedure } from "../trpc";

export const contactRelationshipRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.contactRelationship.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
    });
  }),
} satisfies TRPCRouterRecord;
