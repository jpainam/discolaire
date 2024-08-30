import { cookies } from "next/headers";
import { z } from "zod";

import { schoolYearService } from "../services/school-year-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const schoolYearRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.schoolYear.findMany({
      orderBy: {
        startDate: "desc",
      },
    });
  }),
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.schoolYear.findUnique({
      where: {
        id: input,
      },
    });
  }),
  getDefault: protectedProcedure.query(() => {
    return schoolYearService.getDefault();
  }),
  fromCookie: protectedProcedure.query(() => {
    const schoolYear = cookies().get("schoolYear");
    const schoolYearValue = schoolYear ? schoolYear.value : undefined;
    return schoolYearValue;
  }),
  setAsCookie: protectedProcedure.input(z.string()).mutation(({ input }) => {
    console.log("<<<<<Setting school year as cookie", input);
    return cookies().set({
      name: "schoolYear",
      value: input,
      // Set httpOnly to false when creating the cookie. So the cookie is visible in the client
      httpOnly: false,
      path: "/",
    });
  }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.schoolYear.delete({ where: { id: input } });
    }),
});
