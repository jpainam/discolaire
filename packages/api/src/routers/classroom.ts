import { z } from "zod";

import { PermissionAction } from "@repo/lib/permission";

import { checkPermissions } from "../permission";
import { classroomService } from "../services/classroom-service";
import { contactService } from "../services/contact-service";
import { staffService } from "../services/staff-service";
import { studentService } from "../services/student-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const createUpdateSchema = z.object({
  name: z.string().min(1),
  levelId: z.string(),
  cycleId: z.string(),
  sectionId: z.string(),
  reportName: z.string(),
  maxSize: z.coerce.number().int().positive(),
  seniorAdvisorId: z.string().min(1),
  headTeacherId: z.string().min(1),
});
export const classroomRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const classrooms = await classroomService.getAll({
      schoolYearId: ctx.schoolYearId,
      schoolId: ctx.session.user.schoolId,
    });
    // Has access to all classrooms
    if (await checkPermissions(PermissionAction.READ, "classroom:list")) {
      return classrooms;
    }
    // Has access to classrooms where he teachers
    if (ctx.session.user.profile === "staff") {
      const shortedClassrooms = await staffService.getClassrooms(
        ctx.session.user.id,
        ctx.schoolYearId,
      );
      return classrooms.filter((cl) =>
        shortedClassrooms.some((sc) => sc.id === cl.id),
      );
    }
    // Has access to classrooms where he is a parent
    if (ctx.session.user.profile === "contact") {
      const shortedClassrooms = await contactService.getClassrooms(
        ctx.session.user.id,
        ctx.schoolYearId,
      );
      return classrooms.filter((cl) =>
        shortedClassrooms.some((sc) => sc.id === cl.id),
      );
    }
    // Has access to his classroom
    if (ctx.session.user.profile === "student") {
      const shortedClassroom = await studentService.getClassroomByUserId(
        ctx.session.user.id,
        ctx.schoolYearId,
      );
      return classrooms.filter((cl) => cl.id === shortedClassroom?.id);
    }
    return [];
    // return classrooms.filter((cl) => {
    //   return doPermissionsCheck(
    //     ctx.permissions,
    //     PermissionAction.READ,
    //     "classroom:list",
    //     ctx.schoolId,
    //     {
    //       id: cl.id,
    //     },
    //   );
    // });
  }),
  delete: protectedProcedure
    .input(z.union([z.string(), z.array(z.string())]))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.classroom.deleteMany({
        where: {
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
    }),
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return classroomService.get(input, ctx.schoolId);
  }),
  students: protectedProcedure
    .input(z.string().min(1))
    .query(async ({ input }) => {
      return classroomService.getStudents(input);
    }),
  create: protectedProcedure
    .input(createUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.classroom.create({
        data: {
          name: input.name,
          levelId: input.levelId,
          reportName: input.reportName,
          schoolYearId: ctx.schoolYearId,
          cycleId: input.cycleId,
          sectionId: input.sectionId,
          schoolId: ctx.session.user.schoolId,
          maxSize: input.maxSize,
          seniorAdvisorId: input.seniorAdvisorId,
          headTeacherId: input.headTeacherId,

          //createdById: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  subjects: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return classroomService.getSubjects(input.id);
    }),

  fees: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.fee.findMany({
      where: {
        classroomId: input,
      },
      include: {
        classroom: true,
      },
      orderBy: {
        dueDate: "asc",
      },
    });
  }),

  studentsBalance: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.studentAccount.findMany({
        where: {
          student: {
            enrollments: {
              some: {
                classroomId: input.id,
              },
            },
          },
        },
        orderBy: {
          name: "asc",
        },
        include: {
          transactions: {
            where: {
              schoolYearId: ctx.schoolYearId,
              status: "COMPLETED",
            },
          },
          student: true,
        },
      });

      return result.map((account) => {
        const balance = account.transactions.reduce((acc, transaction) => {
          // if (transaction.status !== "COMPLETED") {
          //   return 0;
          // }
          return transaction.transactionType === "CREDIT"
            ? acc + transaction.amount
            : acc - transaction.amount;
        }, 0);
        return {
          ...account,
          balance: balance,
        };
      });
    }),
  teachers: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.staff.findMany({
        where: {
          subjects: {
            some: {
              classroomId: input,
            },
          },
        },
      });
    }),
  update: protectedProcedure
    .input(createUpdateSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.classroom.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          levelId: input.levelId,
          reportName: input.reportName,
          cycleId: input.cycleId,
          sectionId: input.sectionId,
          maxSize: input.maxSize,
          seniorAdvisorId: input.seniorAdvisorId,
          headTeacherId: input.headTeacherId,
        },
      });
    }),
  gradesheets: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return classroomService.getGradeSheets(input);
  }),
  getMinMaxMoyGrades: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return classroomService.getMinMaxMoyGrades(input);
    }),
  assignments: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return ctx.db.assignment.findMany({
        where: {
          classroomId: input,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          subject: {
            include: {
              course: true,
              teacher: true,
            },
          },
        },
      });
    }),
});
