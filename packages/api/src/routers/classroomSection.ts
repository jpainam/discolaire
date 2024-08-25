import { createTRPCRouter, protectedProcedure } from "../trpc";

export const classroomSectionRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.section.findMany();
  }),
});
