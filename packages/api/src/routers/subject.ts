import { z } from "zod";

import { classroomService } from "../services/classroom-service";
import { subjectService } from "../services/subject-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const subjectRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.subject.findMany({
      include: {
        course: true,
      },
      where: {
        classroom: {
          schoolYearId: ctx.schoolYearId,
          schoolId: ctx.schoolId,
        },
      },
      orderBy: {
        course: {
          name: "asc",
        },
      },
    });
  }),
  get: protectedProcedure
    .input(
      z.object({
        id: z.coerce.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const subject = await ctx.db.subject.findUnique({
        where: {
          id: input.id,
        },
        include: {
          course: true,
          subjectGroup: true,
          teacher: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });
      return subject;
    }),

  create: protectedProcedure
    .input(
      z.object({
        classroomId: z.string().min(1),
        courseId: z.string().min(1),
        teacherId: z.string().min(1),
        subjectGroupId: z.number(),
        order: z.coerce.number().default(1),
        coefficient: z.coerce.number().default(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const staff = await ctx.db.staff.findUnique({
        where: {
          id: input.teacherId,
        },
      });
      const subject = await ctx.db.subject.create({
        data: input,
      });
      if (staff?.userId) {
        void classroomService.addPermission({
          classroomId: input.classroomId,
          resources: [
            "classroom:list",
            "classroom:details",
            "classroom:subject",
          ],
          userId: staff.userId,
          schoolId: ctx.schoolId,
          byId: ctx.session.user.id,
        });
        void subjectService.addPermission({
          resources: ["subject"],
          userId: staff.userId,
          subjectId: subject.id,
          byId: ctx.session.user.id,
          schoolId: ctx.schoolId,
        });
      }
      return subject;
    }),

  updateProgram: protectedProcedure
    .input(z.object({ id: z.coerce.number(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.subject.update({
        where: {
          id: input.id,
        },
        data: {
          program: input.content,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        classroomId: z.string().min(1),
        courseId: z.string().min(1),
        teacherId: z.string().min(1),
        subjectGroupId: z.number(),
        order: z.number(),
        coefficient: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const staff = await ctx.db.staff.findUnique({
        where: {
          id: input.teacherId,
        },
      });
      if (staff?.userId) {
        console.log("Adding permission for classroom", staff.lastName);
        void classroomService.addPermission({
          classroomId: input.classroomId,
          resources: [
            "classroom:list",
            "classroom:details",
            "classroom:subject",
          ],
          userId: staff.userId,
          schoolId: ctx.schoolId,
          byId: ctx.session.user.id,
        });
        console.info("Adding permission for subject", staff.lastName);
        void subjectService.addPermission({
          resources: ["subject"],
          userId: staff.userId,
          subjectId: input.id,
          schoolId: ctx.schoolId,
          byId: ctx.session.user.id,
        });
      }
      return ctx.db.subject.update({
        where: {
          id: id,
        },
        data: data,
      });
    }),

  delete: protectedProcedure
    .input(z.union([z.number(), z.array(z.number())]))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.subject.deleteMany({
        where: {
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
