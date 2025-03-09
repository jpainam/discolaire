import { z } from "zod";

import { enrollmentService } from "../services/enrollment-service";
import { studentService } from "../services/student-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const enrollmentRouter = createTRPCRouter({
  getEnrolledStudents: protectedProcedure
    .input(z.object({ schoolYearId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.student.findMany({
        include: {
          formerSchool: true,
          religion: true,
        },
        where: {
          enrollments: {
            some: {
              schoolYearId: input.schoolYearId
                ? input.schoolYearId
                : ctx.schoolYearId,
            },
          },
        },
      });
      const students = await Promise.all(
        data.map(async (student) => {
          return {
            ...student,
            isRepeating: await studentService.isRepeating(
              student.id,
              ctx.schoolYearId,
            ),
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
        classroomId: z.string(),
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
      return ctx.db.enrollment.createMany({
        data: data,
      });
    }),

  getUnEnrolledStudents: protectedProcedure
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
        take: input.limit,
        orderBy: {
          lastName: "asc",
        },
        where: {
          AND: [
            {
              OR: [
                { firstName: { startsWith: qq, mode: "insensitive" } },
                { lastName: { startsWith: qq, mode: "insensitive" } },
                { residence: { startsWith: qq, mode: "insensitive" } },
                { phoneNumber: { startsWith: qq, mode: "insensitive" } },
                { email: { startsWith: qq, mode: "insensitive" } },
                { registrationNumber: { startsWith: qq, mode: "insensitive" } },
              ],
            },
            {
              enrollments: {
                none: {
                  schoolYearId: ctx.schoolYearId,
                },
              },
            },
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
