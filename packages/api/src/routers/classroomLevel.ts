import { createTRPCRouter, protectedProcedure } from "../trpc";

export const classroomLevelRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.classroomLevel.findMany();
  }),
});
