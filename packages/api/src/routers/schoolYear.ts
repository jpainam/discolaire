import { cookies } from "next/headers";
import { z } from "zod";

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
  getDefault: protectedProcedure.query(async ({ ctx }) => {
    const schoolyear = await ctx.db.schoolYear.findFirst({
      where: {
        isDefault: true,
      },
    });
    if (!schoolyear) {
      return ctx.db.schoolYear.findFirst({
        orderBy: {
          startDate: "desc",
        },
      });
    }
    return schoolyear;
  }),
  fromCookie: protectedProcedure.query(() => {
    const schoolYear = cookies().get("schoolYear");
    const schoolYearValue = schoolYear ? schoolYear.value : undefined;
    return schoolYearValue;
  }),
  setAsCookie: protectedProcedure.input(z.string()).mutation(({ input }) => {
    cookies().set({
      name: "schoolYear",
      value: input,
      //httpOnly: true,
      path: "/",
    });
  }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.schoolYear.delete({ where: { id: input } });
    }),
});
