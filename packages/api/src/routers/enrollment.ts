import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import { env } from "../env";
import { ActivityAction, ActivityTargetType } from "../activity-logger";
import { protectedProcedure } from "../trpc";

export const enrollmentRouter = {
  all: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().optional().default(10),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const studentIds: string[] = [];
      if (ctx.session.user.profile === "student") {
        const student = await ctx.services.student.getFromUserId(
          ctx.session.user.id,
        );
        studentIds.push(student.id);
      } else if (ctx.session.user.profile === "contact") {
        const contact = await ctx.services.contact.getFromUserId(
          ctx.session.user.id,
        );
        const studentContacts = await ctx.services.contact.getStudents(
          contact.id,
        );
        studentIds.push(...studentContacts.map((sc) => sc.studentId));
      }
      return ctx.services.enrollment.getEnrollStudents({
        schoolYearId: ctx.schoolYearId,
        limit: input?.limit,
        studentIds,
      });
    }),
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
          const isRep = await ctx.services.student.isRepeating(
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
            isRepeating: await ctx.services.student.isRepeating(
              student.id,
              ctx.schoolYearId,
            ),
            classroom: await ctx.services.student.getClassroom(
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
      const studentIds = Array.isArray(input.studentId)
        ? input.studentId
        : [input.studentId];

      for (const studentId of studentIds) {
        const { name, balance } = await ctx.services.student.getOverallBalance({
          studentId,
        });
        if (balance < 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Impossible d'inscrire ${name}. avec une balance négative de: ${balance}`,
          });
        }
      }

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

      const students = await ctx.db.student.findMany({
        where: { id: { in: studentIds } },
        select: { id: true, firstName: true, lastName: true, registrationNumber: true },
      });
      const studentMap = new Map(students.map((s) => [s.id, s]));

      const results = await Promise.all(
        data.map(async (e) => {
          const enr = await ctx.db.enrollment.create({ data: e });
          const student = studentMap.get(e.studentId);
          const name = student
            ? `${student.firstName} ${student.lastName}`.trim()
            : e.studentId;
          ctx.activityLog.log({
            action: ActivityAction.ENROLLED,
            targetType: ActivityTargetType.STUDENT,
            targetId: e.studentId,
            description: `${ctx.activityLog.actor} a inscrit l'élève <a href="/students/${e.studentId}">${name}</a>`,
            metadata: { entityName: name, actorName: ctx.activityLog.actor },
          });

          // Send enrollment notification email.
          // Awaited so it always completes regardless of deployment target,
          // but errors are caught so they never fail the enrollment itself.
          try {
            await fetch(`${ctx.baseUrl}/api/emails/enrollment`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": env.DISCOLAIRE_API_KEY,
              },
              body: JSON.stringify({
                tenant: ctx.tenant,
                studentId: e.studentId,
                classroomId: e.classroomId,
                schoolYearId: e.schoolYearId,
              }),
            });
          } catch (err) {
            console.error(
              `[enrollment.create] Failed to send email for student ${e.studentId}:`,
              err,
            );
          }

          return enr;
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
          status: "ACTIVE",
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

      const students = await ctx.db.student.findMany({
        where: { id: { in: studentIds } },
        select: { id: true, firstName: true, lastName: true, registrationNumber: true },
      });
      const studentMap = new Map(students.map((s) => [s.id, s]));

      ctx.activityLog.logMany(
        studentIds.map((studentId) => {
          const student = studentMap.get(studentId);
          const name = student
            ? `${student.firstName} ${student.lastName}`.trim()
            : studentId;
          return {
            action: ActivityAction.UNENROLLED,
            targetType: ActivityTargetType.STUDENT,
            targetId: studentId,
            description: `${ctx.activityLog.actor} a retiré l'élève <a href="/students/${studentId}">${name}</a> de sa classe`,
            metadata: { entityName: name, actorName: ctx.activityLog.actor },
          };
        }),
      );

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
      const enrollmentIds = Array.isArray(input) ? input : [input];

      const enrollments = await ctx.db.enrollment.findMany({
        where: { id: { in: enrollmentIds } },
        include: {
          student: { select: { id: true, firstName: true, lastName: true, registrationNumber: true } },
        },
      });

      ctx.activityLog.logMany(
        enrollments.map((enr) => {
          const name = `${enr.student.firstName} ${enr.student.lastName}`.trim();
          return {
            action: ActivityAction.UNENROLLED,
            targetType: ActivityTargetType.STUDENT,
            targetId: enr.studentId,
            description: `${ctx.activityLog.actor} a retiré l'élève <a href="/students/${enr.studentId}">${name}</a> de sa classe`,
            metadata: { entityName: name, actorName: ctx.activityLog.actor },
          };
        }),
      );

      return ctx.db.enrollment.deleteMany({
        where: {
          id: {
            in: enrollmentIds,
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
    .query(({ ctx, input }) => {
      return ctx.services.enrollment.getCount(
        input.schoolYearId ?? ctx.schoolYearId,
      );
    }),

  getStudents: protectedProcedure
    .input(
      z.object({
        schoolYearId: z.string().optional(),
        limit: z.number().optional().default(50),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.services.enrollment.getEnrollStudents({
        schoolYearId: input.schoolYearId ?? ctx.schoolYearId,
        limit: input.limit,
        studentIds: [],
      });
    }),
  canEnroll: protectedProcedure
    .input(z.object({ studentId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.services.student.getOverallBalance({
        studentId: input.studentId,
      });
    }),
} satisfies TRPCRouterRecord;
