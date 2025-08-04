import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

const createSubjectJournalSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  publishDate: z.coerce.date(),
  subjectId: z.coerce.number(),
  attachment: z.string().optional(),
});
export const teachingSessionRouter = {
  all: protectedProcedure
    .input(
      z.object({
        limit: z.coerce.number().default(10),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.teachingSession.findMany({
        orderBy: {
          createdAt: "asc",
        },
        take: input.limit,
        include: {
          createdBy: true,
          programSessions: {
            include: {
              program: {
                include: {
                  subject: true,
                },
              },
            },
          },
        },
        where: {
          programSessions: {
            some: {
              program: {
                subject: {
                  classroom: {
                    schoolYearId: ctx.schoolYearId,
                    schoolId: ctx.schoolId,
                  },
                },
              },
            },
          },
        },
      });
    }),
  clearAll: protectedProcedure
    .input(z.object({ subjectId: z.coerce.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.teachingSession.deleteMany({
        where: {
          subjectId: input.subjectId,
        },
      });
    }),
  bySubject: protectedProcedure
    .input(
      z.object({
        subjectId: z.coerce.number(),
        pageIndex: z.coerce.number().default(0),
        pageSize: z.coerce.number().default(10),
      }),
    )
    .query(({ ctx, input }) => {
      const offset = input.pageIndex * input.pageSize;
      return ctx.db.teachingSession.findMany({
        skip: offset,
        take: input.pageSize,
        orderBy: {
          createdAt: "asc",
        },
        include: {
          createdBy: true,
        },
        where: {
          subjectId: input.subjectId,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.teachingSession.delete({
        where: {
          id: input,
        },
      });
    }),
  update: protectedProcedure
    .input(createSubjectJournalSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.teachingSession.update({
        where: {
          id: input.id,
        },
        data: input,
      });
    }),
  create: protectedProcedure
    .input(createSubjectJournalSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.teachingSession.create({
        data: {
          ...input,
          createdById: ctx.session.user.id,
        },
      });
    }),
  get: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.teachingSession.findUniqueOrThrow({
      where: {
        id: input,
      },
      include: {
        createdBy: true,
      },
    });
  }),
} satisfies TRPCRouterRecord;
