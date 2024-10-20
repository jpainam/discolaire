import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const createSubjectJournalSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  date: z.coerce.date(),
  subjectId: z.coerce.number(),
  attachments: z.array(z.string()),
  status: z.enum(["APPROVED", "PENDING", "REJECTED"]).default("PENDING"),
});
export const subjectJournalRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.subjectJournal.findMany({
      orderBy: {
        createdAt: "asc",
      },
      include: {
        createdBy: true,
        subject: true,
      },
      where: {
        schoolId: ctx.schoolId,
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
          subject: true,
        },
        where: {
          subjectId: input.subjectId,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.coerce.number())
    .mutation(async ({ ctx, input }) => {
      const s = await ctx.db.subjectJournal.findUnique({
        where: {
          id: input,
        },
      });
      if (!s || s.schoolId !== ctx.schoolId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subject journal not found",
        });
      }
      return ctx.db.subjectJournal.delete({
        where: {
          id: input,
        },
      });
    }),
  update: protectedProcedure
    .input(createSubjectJournalSchema.extend({ id: z.coerce.number() }))
    .mutation(async ({ ctx, input }) => {
      const s = await ctx.db.subjectJournal.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!s || s.schoolId !== ctx.schoolId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subject journal not found",
        });
      }
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
          ...input,
          createdById: ctx.session.user.id,
          schoolId: ctx.schoolId,
        },
      });
    }),
  get: protectedProcedure
    .input(z.coerce.number())
    .query(async ({ ctx, input }) => {
      const subjectJournal = await ctx.db.subjectJournal.findUnique({
        where: {
          id: input,
        },
        include: {
          createdBy: true,
          subject: true,
        },
      });
      if (!subjectJournal || subjectJournal.schoolId !== ctx.schoolId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subject journal not found",
        });
      }
      return subjectJournal;
    }),
});
