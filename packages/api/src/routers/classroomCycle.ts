import { createTRPCRouter, protectedProcedure } from "../trpc";

export const classroomCycleRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.cycle.findMany();
  }),
});
