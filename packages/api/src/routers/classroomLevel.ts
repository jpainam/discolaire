import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const classroomLevelRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.classroomLevel.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
      orderBy: {
        order: "asc",
      },
    });
  }),

  count: protectedProcedure.query(async ({ ctx }) => {
    const countClassroom = await ctx.db.classroom.groupBy({
      by: ["levelId"],
      where: {
        schoolYearId: ctx.schoolYearId,
        schoolId: ctx.schoolId,
      },
      _count: {
        levelId: true,
      },
    });
    const countEffectif = await ctx.db.enrollment.groupBy({
      by: ["classroomId"],
      where: {
        classroom: {
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
        },
      },
      _count: {
        studentId: true,
      },
    });
    const classrooms = await ctx.db.classroom.findMany({
      where: {
        schoolId: ctx.schoolId,
        schoolYearId: ctx.schoolYearId,
      },
    });
    const effectifMap: Record<string, number> = {};
    classrooms.forEach((c) => {
      const eff = effectifMap[c.levelId] ?? 0;
      effectifMap[c.levelId] =
        eff +
        (countEffectif.find((e) => e.classroomId === c.id)?._count.studentId ??
          0);
    });
    const levels = await ctx.db.classroomLevel.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
      orderBy: {
        order: "asc",
      },
    });
    return levels.map((l) => {
      return {
        name: l.name,
        count:
          countClassroom.find((c) => c.levelId === l.id)?._count.levelId ?? 0,
        effectif: effectifMap[l.id] ?? 0,
      };
    });
  }),
  delete: protectedProcedure
    .input(z.union([z.coerce.string(), z.array(z.coerce.string())]))
    .mutation(async ({ ctx, input }) => {
      const ids = Array.isArray(input) ? input : [input];
      const classrooms = await ctx.db.classroom.findMany({
        where: {
          schoolId: ctx.schoolId,
          levelId: {
            in: ids,
          },
        },
      });
      if (classrooms.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot delete level with classrooms",
        });
      }
      return ctx.db.classroomLevel.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        order: z.coerce.number().int().min(0),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.classroomLevel.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          order: input.order,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        order: z.coerce.number().int().min(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const count = await ctx.db.classroomLevel.count();
      return ctx.db.classroomLevel.create({
        data: {
          name: input.name,
          schoolId: ctx.session.user.schoolId,
          order: input.order == 0 ? count + 1 : input.order,
        },
      });
    }),
});
