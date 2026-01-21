import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import { TransactionStatus, TransactionType } from "@repo/db/enums";

import { protectedProcedure } from "../trpc";
import { buildPermissionIndex, checkPermission } from "../utils";

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
export const classroomRouter = {
  all: protectedProcedure.query(async ({ ctx }) => {
    const classrooms = await ctx.services.classroom.getAll({
      schoolYearId: ctx.schoolYearId,
      schoolId: ctx.session.user.schoolId,
    });
    if (ctx.session.user.profile === "student") {
      const student = await ctx.services.student.getFromUserId(
        ctx.session.user.id,
      );
      const classroom = await ctx.services.student.getClassroom(
        student.id,
        ctx.schoolYearId,
      );
      return classrooms.filter((cl) => cl.id === classroom?.id);
    }
    if (ctx.session.user.profile === "contact") {
      const contact = await ctx.services.contact.getFromUserId(
        ctx.session.user.id,
      );
      const classes = await ctx.services.contact.getClassrooms(
        contact.id,
        ctx.schoolYearId,
        ctx.schoolId,
      );
      const classesIds = classes.map((c) => c.id);
      return classrooms.filter((cl) => classesIds.includes(cl.id));
    }
    // Has access to classrooms where he teachers
    if (ctx.session.user.profile === "staff") {
      const permissionIndex = buildPermissionIndex(ctx.permissions);
      if (checkPermission("classroom.read", {}, permissionIndex)) {
        return classrooms;
      }
      const staff = await ctx.services.staff.getFromUserId(ctx.session.user.id);
      const classes = await ctx.services.staff.getClassrooms(
        staff.id,
        ctx.schoolYearId,
      );
      const classesIds = classes.map((c) => c.id);
      return classrooms.filter((cl) => classesIds.includes(cl.id));
    }
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You are not allowed to access this resource",
    });
  }),
  delete: protectedProcedure
    .input(z.union([z.string(), z.array(z.string())]))
    .mutation(async ({ ctx, input }) => {
      const classroomIds = Array.isArray(input) ? input : [input];
      await ctx.pubsub.publish("classroom", {
        type: "delete",
        data: {
          id: classroomIds.join(","),
        },
      });
      return ctx.db.classroom.deleteMany({
        where: {
          id: {
            in: classroomIds,
          },
        },
      });
    }),
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.services.classroom.get(input, ctx.schoolId);
  }),
  students: protectedProcedure
    .input(z.string().min(1))
    .query(async ({ input, ctx }) => {
      const students = await ctx.services.classroom.getStudents(input);
      if (ctx.session.user.profile === "student") {
        return students.filter(
          (student) => student.userId === ctx.session.user.id,
        );
      } else if (ctx.session.user.profile === "contact") {
        const contact = await ctx.services.contact.getFromUserId(
          ctx.session.user.id,
        );
        const studs = await ctx.services.contact.getStudents(contact.id);
        const studentIds = studs.map((s) => s.studentId);
        return students.filter((student) => studentIds.includes(student.id));
      }
      return students;
    }),
  create: protectedProcedure
    .input(createUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const cl = await ctx.db.classroom.create({
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
          createdById: ctx.session.user.id,
        },
      });
      await ctx.pubsub.publish("classroom", {
        type: "create",
        data: {
          id: cl.id,
          metadata: {
            name: cl.name,
          },
        },
      });
      return cl;
    }),

  subjects: protectedProcedure
    .input(z.string().min(1))
    .query(({ input, ctx }) => {
      return ctx.services.classroom.getSubjects(input);
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
    .input(z.string().min(1)) // classroomId
    .query(async ({ ctx, input }) => {
      let students = await ctx.services.classroom.getStudents(input);

      if (ctx.session.user.profile === "student") {
        students = students.filter(
          (student) => student.userId === ctx.session.user.id,
        );
      } else if (ctx.session.user.profile === "contact") {
        const contact = await ctx.services.contact.getFromUserId(
          ctx.session.user.id,
        );
        const studs = await ctx.services.contact.getStudents(contact.id);
        const studentIds = studs.map((s) => s.studentId);
        students = students.filter((student) =>
          studentIds.includes(student.id),
        );
      }

      const studentIds = students.map((std) => std.id);
      const transactions = await ctx.db.transaction.findMany({
        where: {
          schoolYearId: ctx.schoolYearId,
          status: TransactionStatus.VALIDATED,
          deletedAt: null,
          student: {
            id: {
              in: studentIds,
            },
            enrollments: {
              some: {
                classroomId: input,
              },
            },
          },
        },
        orderBy: {
          student: {
            lastName: "asc",
          },
        },
        include: {
          student: {
            include: {
              user: true,
            },
          },
        },
      });

      // Aggregate per (studentId, journalId)
      const balances: Record<string, Record<string, number>> = {};

      transactions.forEach((transaction) => {
        if (!transaction.journalId) return;

        const studentId = transaction.studentId;
        const journalId = transaction.journalId;

        balances[studentId] ??= {};
        balances[studentId][journalId] ??= 0;
        const delta =
          transaction.transactionType === TransactionType.DEBIT
            ? -transaction.amount
            : transaction.amount;

        balances[studentId][journalId] += delta;
      });

      const journals = await ctx.db.accountingJournal.findMany({
        where: {
          schoolYearId: ctx.schoolYearId,
          schoolId: ctx.session.user.schoolId,
        },
      });
      return students.map((student) => {
        const studentBalances = balances[student.id] ?? {};

        // const journalsBalances = Object.entries(studentBalances).map(
        //   ([journalId, balance]) => ({
        //     journalId,
        //     balance,
        //   }),
        // );

        // To include journals with zero balance, you could do:
        const journalsBalances = journals.map((journal) => ({
          journalId: journal.id,
          name: journal.name,
          balance: studentBalances[journal.id] ?? 0,
        }));

        return {
          ...student,
          studentId: student.id,
          journals: journalsBalances, // [{ journalId, balance }]
        };
      });
    }),
  teachers: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.staff.findMany({
        orderBy: {
          lastName: "asc",
        },
        include: {
          user: true,
        },
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
      await ctx.pubsub.publish("classroom", {
        type: "update",
        data: {
          id: input.id,
          metadata: {
            name: input.name,
          },
        },
      });
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
  gradesheets: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return ctx.services.classroom.getGradeSheets(input);
    }),
  getMinMaxMoyGrades: protectedProcedure
    .input(z.string())
    .query(({ input, ctx }) => {
      return ctx.services.classroom.getMinMaxMoyGrades(input);
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
          term: true,
          subject: {
            include: {
              course: true,
              teacher: true,
            },
          },
        },
      });
    }),
} satisfies TRPCRouterRecord;
