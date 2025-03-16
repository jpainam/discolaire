import { z } from "zod";

import { enrollmentService } from "../services/enrollment-service";
import { isRepeating, studentService } from "../services/student-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const enrollmentRouter = createTRPCRouter({
  students: protectedProcedure
    .input(z.object({ classroomId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      // TODO Use this to replace classroom.student in classroom/[id]enrollment
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
      // if (Array.isArray(input.studentId)) {
      //   await Promise.all(
      //     input.studentId.map((studId) => {
      //       const key = `student:${studId}:schoolYear:${ctx.schoolYearId}:isRepeating`;
      //       return redisClient.del(key);
      //     }),
      //   );
      // } else {
      //   const key = `student:${input.studentId}:schoolYear:${ctx.schoolYearId}:isRepeating`;
      //   await redisClient.del(key);
      // }
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
      // const enrollments = await ctx.db.enrollment.findMany({
      //   where: {
      //     studentId: {
      //       in: Array.isArray(input.studentId)
      //         ? input.studentId
      //         : [input.studentId],
      //     },
      //     classroomId: input.classroomId,
      //   },
      // });
      // await Promise.all(
      //   enrollments.map((enr) => {
      //     const key = `student:${enr.studentId}:schoolYear:${enr.schoolYearId}:isRepeating`;
      //     void redisClient.del(key);
      //   }),
      // );
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
      // const enrollments = await ctx.db.enrollment.findMany({
      //   where: {
      //     id: {
      //       in: Array.isArray(input) ? input : [input],
      //     },
      //   },
      // });
      // await Promise.all(
      //   enrollments.map((enr) => {
      //     const key = `student:${enr.studentId}:schoolYear:${enr.schoolYearId}:isRepeating`;
      //     void redisClient.del(key);
      //   }),
      // );
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
