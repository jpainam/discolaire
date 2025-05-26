import { z } from "zod";

import { enrollmentService } from "../services/enrollment-service";
import { isRepeating, studentService } from "../services/student-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const enrollmentRouter = createTRPCRouter({
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
            none: {
              schoolYear: {
                name: {
                  gt: schoolYear.name,
                },
              },
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
            };
          })
        : [
            {
              studentId: input.studentId,
              classroomId: input.classroomId,
              observation: input.observation,
              schoolYearId: ctx.schoolYearId,
            },
          ];
      const dataLog = data.map((enrollment) => {
        return {
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
          userId: ctx.session.user.id,
          title: "Student enrollment",
          type: "CREATE" as const,
          url: `/students/${enrollment.studentId}/enrollments`,
          entityId: enrollment.studentId,
          entityType: "student",
        };
      });
      await ctx.db.logActivity.createMany({ data: dataLog });
      return ctx.db.enrollment.createMany({
        data: data,
      });
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
            { email: { startsWith: qq, mode: "insensitive" } },
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

      const data = studentIds.map((studentId) => {
        return {
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
          userId: ctx.session.user.id,
          title: "Student enrollment",
          type: "DELETE" as const,
          url: `/students/${studentId}/enrollments`,
          entityId: studentId,
          entityType: "student",
        };
      });
      await ctx.db.logActivity.createMany({
        data: data,
      });

      return ctx.db.enrollment.deleteMany({
        where: {
          studentId: {
            in: Array.isArray(input.studentId)
              ? input.studentId
              : [input.studentId],
          },
          classroomId: input.classroomId,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.union([z.array(z.coerce.number()), z.coerce.number()]))
    .mutation(async ({ ctx, input }) => {
      const studentIds = Array.isArray(input) ? input : [input];
      const enrollments = await ctx.db.enrollment.findMany({
        where: {
          id: {
            in: studentIds,
          },
        },
      });
      const data = enrollments.map((enrollment) => {
        return {
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
          userId: ctx.session.user.id,
          title: "Student enrollment",
          type: "DELETE" as const,
          url: `/students/${enrollment.studentId}/enrollments`,
          entityId: enrollment.studentId,
          entityType: "student",
        };
      });
      await ctx.db.logActivity.createMany({
        data: data,
      });
      return ctx.db.enrollment.deleteMany({
        where: {
          id: {
            in: Array.isArray(input) ? input : [input],
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
});
