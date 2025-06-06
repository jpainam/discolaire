import type { TRPCRouterRecord } from "@trpc/server";

import { protectedProcedure } from "../trpc";

export const subjectGroupRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.subjectGroup.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
    });
  }),
} satisfies TRPCRouterRecord;
