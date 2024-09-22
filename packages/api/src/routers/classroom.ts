import { z } from "zod";

import { classroomService } from "../services/classroom-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const createUpdateSchema = z.object({
  name: z.string().min(1),
  levelId: z.string(),
  cycleId: z.number(),
  sectionId: z.number(),
  reportName: z.string(),
});
export const classroomRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const classroomsWithStats = await ctx.db.classroom.findMany({
      orderBy: {
        levelId: "asc",
      },
      where: {
        schoolYearId: ctx.schoolYearId,
      },
      include: {
        level: true,
        cycle: true,
        section: true,
        classroomLeader: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        headTeacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        seniorAdvisor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        enrollments: {
          select: {
            student: {
              select: {
                gender: true,
              },
            },
          },
        },
      },
    });

    const classroomsWithSize = classroomsWithStats.map((c) => {
      const totalStudents = c.enrollments.length;
      const femaleCount = c.enrollments.filter(
        (e) => e.student.gender === "female",
      ).length;
      const maleCount = c.enrollments.filter(
        (e) => e.student.gender === "male",
      ).length;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { enrollments, ...classroomWithoutEnrollments } = c;
      return {
        ...classroomWithoutEnrollments,
        size: totalStudents,
        femaleCount,
        maleCount,
      };
    });
    return classroomsWithSize;
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
    const classroom = await ctx.db.classroom.findUnique({
      where: {
        id: input,
      },
      include: {
        level: true,
        cycle: true,
        section: true,
        classroomLeader: true,
        headTeacher: true,
        seniorAdvisor: true,
      },
    });
    const count = await classroomService.getCount(input);
    return {
      ...classroom,
      femaleCount: count.female,
      maleCount: count.male,
      size: count.size,
    };
  }),
  students: protectedProcedure.input(z.string()).query(async ({ input }) => {
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
        journal: true,
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
