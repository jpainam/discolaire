import { z } from "zod";

import { submitReportJob } from "../services/reporting-service";
import { schoolService } from "../services/school-service";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const reportingRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.reporting.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  clearAll: protectedProcedure.mutation(({ ctx }) => {
    return ctx.db.reporting.deleteMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  userReports: protectedProcedure.query(({ ctx }) => {
    return ctx.db.reporting.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  get: protectedProcedure.input(z.coerce.number()).query(({ ctx, input }) => {
    return ctx.db.reporting.findUnique({
      where: {
        id: input,
      },
    });
  }),
  delete: protectedProcedure
    .input(z.union([z.coerce.number(), z.array(z.coerce.number())]))
    .mutation(({ ctx, input }) => {
      return ctx.db.reporting.deleteMany({
        where: {
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        id: z.coerce.number(),
        url: z.string().url().min(1),
        status: z.enum(["COMPLETED", "FAILED"]),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.reporting.update({
        where: {
          id: input.id,
          userId: input.userId,
        },
        data: {
          url: input.url,
          status: input.status,
        },
      });
    }),
  submitReport: protectedProcedure
    .input(
      z.object({
        endpoint: z.string().min(1),
        title: z.string().min(1),
        data: z.record(z.any()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const report = await ctx.db.reporting.create({
        data: {
          userId: ctx.session.user.id,
          title: input.title,
          status: "PENDING",
          type: input.endpoint.includes("excel") ? "excel" : "pdf",
          url: "",
          schoolId: ctx.schoolId,
        },
      });
      const school = await schoolService.get(ctx.schoolId);
      return submitReportJob(input.endpoint, {
        id: report.id,
        school: school,
        userId: ctx.session.user.id,
        ...input.data,
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        type: z.enum(["pdf", "excel"]),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.reporting.create({
        data: {
          title: input.title,
          schoolId: ctx.schoolId,
          type: input.type,
          url: "",
          userId: ctx.session.user.id,
        },
      });
    }),
});
