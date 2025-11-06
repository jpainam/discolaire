import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

const createSubjectJournalSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  publishDate: z.coerce.date(),
  sessionCount: z.coerce.number(),
  subjectId: z.coerce.number(),
  programId: z.string(),
  attachment: z.string().optional(),
});
export const subjectJournalRouter = {
  all: protectedProcedure
    .input(
      z.object({
        limit: z.coerce.number().default(10),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.subjectJournal.findMany({
        orderBy: {
          createdAt: "asc",
        },
        take: input.limit,
        include: {
          createdBy: true,
          program: true,
        },
        where: {
          program: {
            subject: {
              classroom: {
                schoolYearId: ctx.schoolYearId,
              },
            },
          },
        },
      });
    }),
  clearAll: protectedProcedure
    .input(z.object({ subjectId: z.coerce.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.subjectJournal.deleteMany({
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
      return ctx.db.subjectJournal.findMany({
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
      return ctx.db.subjectJournal.delete({
        where: {
          id: input,
        },
      });
    }),
  update: protectedProcedure
    .input(createSubjectJournalSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.subjectJournal.update({
        where: {
          id: input.id,
        },
        data: input,
      });
    }),
  create: protectedProcedure
    .input(createSubjectJournalSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.subjectJournal.create({
        data: {
          subjectId: input.subjectId,
          title: input.title,
          content: input.content,
          programId: input.programId,
          publishDate: input.publishDate,
          sessionCount: input.sessionCount,
          createdById: ctx.session.user.id,
          attachment: input.attachment,
        },
      });
    }),
  get: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.subjectJournal.findUniqueOrThrow({
      where: {
        id: input,
      },
      include: {
        createdBy: true,
      },
    });
  }),
} satisfies TRPCRouterRecord;
