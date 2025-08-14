import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import {
  enrollmentService,
  getEnrollStudents,
} from "../services/enrollment-service";
import { isRepeating, studentService } from "../services/student-service";
import { protectedProcedure } from "../trpc";

export const enrollmentRouter = {
  students: protectedProcedure
    .input(z.object({ classroomId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      // TODO Use this to replace classroom.student in classroom/[id]/enrollment
      const enrollments = await ctx.db.enrollment.findMany({
        where: {
          classroomId: input.classroomId,
        },
        include: {
          student: {
            include: {
              formerSchool: true,
              religion: true,
            },
          },
        },
      });
      const enrollmentWithRepeating = await Promise.all(
        enrollments.map(async (enrollment) => {
          const isRep = await isRepeating(
            enrollment.student.id,
            ctx.schoolYearId,
          );
          return {
            ...enrollment,
            student: {
              ...enrollment.student,
              isRepeating: isRep,
            },
          };
        }),
      );
      return enrollmentWithRepeating;
    }),
  enrolled: protectedProcedure
    .input(z.object({ schoolYearId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const schoolYear = await ctx.db.schoolYear.findUniqueOrThrow({
        where: { id: input.schoolYearId ?? ctx.schoolYearId },
      });

      const data = await ctx.db.student.findMany({
        include: {
          formerSchool: true,
          religion: true,
          user: true,
          enrollments: {
            where: {
              schoolYear: {
                name: {
                  lte: schoolYear.name,
                },
              },
            },
          },
        },
        where: {
          enrollments: {
            some: {
              schoolYearId: input.schoolYearId ?? ctx.schoolYearId,
            },
          },
        },
      });
      const students = await Promise.all(
        data.map(async (student) => {
          return {
            ...student,
            isRepeating: await isRepeating(student.id, ctx.schoolYearId),
            classroom: await studentService.getClassroom(
              student.id,
              ctx.schoolYearId,
            ),
          };
        }),
      );
      return students;
    }),
  create: protectedProcedure
    .input(
      z.object({
        studentId: z.union([z.string(), z.array(z.string())]),
        classroomId: z.string().min(1),
        observation: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const data = Array.isArray(input.studentId)
        ? input.studentId.map((studId) => {
            return {
              studentId: studId,
              classroomId: input.classroomId,
              observation: input.observation,
              schoolYearId: ctx.schoolYearId,
              createdById: ctx.session.user.id,
            };
          })
        : [
            {
              studentId: input.studentId,
              classroomId: input.classroomId,
              observation: input.observation,
              schoolYearId: ctx.schoolYearId,
              createdById: ctx.session.user.id,
            },
          ];

      const results = await Promise.all(
        data.map(async (e) => {
          const enr = await ctx.db.enrollment.create({ data: e });
          await ctx.pubsub.publish("enrollment", {
            type: "create",
            data: {
              id: enr.id.toString(),
            },
          });
        }),
      );
      return results;
    }),

  unenrolled: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(10),
        page: z.number().optional().default(1),
        q: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const qq = `%${input.q}%`;
      return ctx.db.student.findMany({
        include: {
          user: true,
        },
        take: input.limit,
        orderBy: {
          lastName: "asc",
        },
        where: {
          schoolId: ctx.schoolId,
          enrollments: {
            none: {
              schoolYearId: ctx.schoolYearId,
            },
          },
          OR: [
            { firstName: { startsWith: qq, mode: "insensitive" } },
            { lastName: { startsWith: qq, mode: "insensitive" } },
            { residence: { startsWith: qq, mode: "insensitive" } },
            { phoneNumber: { startsWith: qq, mode: "insensitive" } },
            // { email: { startsWith: qq, mode: "insensitive" } },
            { registrationNumber: { startsWith: qq, mode: "insensitive" } },
          ],
        },
      });
    }),

  deleteByStudentIdClassroomId: protectedProcedure
    .input(
      z.object({
        studentId: z.union([z.array(z.string()), z.string()]),
        classroomId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const studentIds = Array.isArray(input.studentId)
        ? input.studentId
        : [input.studentId];
      await ctx.pubsub.publish("enrollment", {
        type: "delete",
        data: {
          id: studentIds.join(","),
        },
      });
      return ctx.db.enrollment.deleteMany({
        where: {
          studentId: {
            in: studentIds,
          },
          classroomId: input.classroomId,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.union([z.array(z.coerce.number()), z.coerce.number()]))
    .mutation(async ({ ctx, input }) => {
      const studentIds = Array.isArray(input) ? input : [input];

      await ctx.pubsub.publish("enrollment", {
        type: "delete",
        data: {
          id: studentIds.join(","),
        },
      });

      return ctx.db.enrollment.deleteMany({
        where: {
          id: {
            in: studentIds,
          },
        },
      });
    }),
  count: protectedProcedure
    .input(
      z.object({
        schoolYearId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return enrollmentService.getCount(input.schoolYearId ?? ctx.schoolYearId);
    }),

  getStudents: protectedProcedure
    .input(
      z.object({
        schoolYearId: z.string().optional(),
        limit: z.number().optional().default(50),
      }),
    )
    .query(async ({ ctx, input }) => {
      return getEnrollStudents({
        schoolYearId: input.schoolYearId ?? ctx.schoolYearId,
        limit: input.limit,
        studentIds: [],
      });
    }),
} satisfies TRPCRouterRecord;
