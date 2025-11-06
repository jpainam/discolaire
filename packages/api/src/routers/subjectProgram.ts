import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const subjectProgramRouter = {
  all: protectedProcedure
    .input(
      z.object({
        classroomId: z.string().nullish(),
        termId: z.string().nullish(),
        teacherId: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.subjectProgram.findMany({
        where: {
          ...(input.termId ? { termId: input.termId } : {}),
          term: {
            schoolYearId: ctx.schoolYearId,
          },
          subject: {
            ...(input.teacherId ? { teacherId: input.teacherId } : {}),
            ...(input.classroomId ? { classroomId: input.classroomId } : {}),
          },
        },
        include: {
          term: true,
          subject: {
            include: {
              classroom: true,
              course: true,
              teacher: true,
            },
          },
          journals: true,
        },
      });
    }),
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.subjectProgram.findUniqueOrThrow({
      include: {
        subject: true,
        term: true,
        journals: true,
      },
      where: {
        id: input,
      },
    });
  }),
  programs: protectedProcedure
    .input(
      z.object({
        subjectId: z.coerce.number(),
        termId: z.string().optional(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.subjectProgram.findMany({
        include: {
          term: true,
          subject: {
            include: {
              course: true,
              teacher: true,
            },
          },
          journals: true,
          createdBy: true,
        },
        orderBy: {
          term: {
            startDate: "asc",
          },
        },
        where: {
          subjectId: input.subjectId,
          ...(input.termId ? { termId: input.termId } : {}),
        },
      });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.subjectProgram.delete({
        where: {
          id: input,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        priority: z.enum(["MEDIUM", "HIGH", "URGENT", "LOW"]),
        requiredSessionCount: z.number().positive().default(1),
        subjectId: z.coerce.number(),
        termId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.subjectProgram.create({
        data: {
          title: input.title,
          description: input.description,
          priority: input.priority,
          requiredSessionCount: input.requiredSessionCount,
          subjectId: input.subjectId,
          termId: input.termId,
          createdById: ctx.session.user.id,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1),
        description: z.string().optional(),
        requiredSessionCount: z.number().positive().default(1),
        priority: z.enum(["MEDIUM", "HIGH", "URGENT", "LOW"]),
        termId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.subjectProgram.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          description: input.description,
          priority: input.priority,
          requiredSessionCount: input.requiredSessionCount,
          termId: input.termId,
        },
      });
    }),
  classroom: protectedProcedure
    .input(
      z.object({
        classroomId: z.string(),
        teacherId: z.string().optional(),
        termId: z.string().optional(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.subjectProgram.findMany({
        where: {
          subject: {
            ...(input.teacherId ? { teacherId: input.teacherId } : {}),
            classroomId: input.classroomId,
          },
          ...(input.termId ? { termId: input.termId } : {}),
        },
      });
    }),
} satisfies TRPCRouterRecord;
