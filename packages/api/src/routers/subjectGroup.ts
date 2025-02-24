import { createTRPCRouter, protectedProcedure } from "../trpc";

export const subjectGroupRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.subjectGroup.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
    });
  }),
});
