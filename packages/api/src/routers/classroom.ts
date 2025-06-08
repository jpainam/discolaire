import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { TransactionStatus } from "@repo/db";

import { checkPermission } from "../permission";
import { classroomService } from "../services/classroom-service";
import { contactService } from "../services/contact-service";
import { staffService } from "../services/staff-service";
import { studentService } from "../services/student-service";
import { protectedProcedure } from "../trpc";

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
    const classrooms = await classroomService.getAll({
      schoolYearId: ctx.schoolYearId,
      schoolId: ctx.session.user.schoolId,
    });
    if (ctx.session.user.profile === "student") {
      const classroom = await studentService.getClassroomByUserId(
        ctx.session.user.id,
        ctx.schoolYearId,
      );
      return classrooms.filter((cl) => cl.id === classroom?.id);
    }
    if (ctx.session.user.profile === "contact") {
      const contact = await contactService.getFromUserId(ctx.session.user.id);
      const classes = await contactService.getClassrooms(
        contact.id,
        ctx.schoolYearId,
        ctx.schoolId,
      );
      const classesIds = classes.map((c) => c.id);
      return classrooms.filter((cl) => classesIds.includes(cl.id));
    }
    // Has access to classrooms where he teachers
    if (ctx.session.user.profile === "staff") {
      if (checkPermission("classroom", "Read", {}, ctx.permissions)) {
        return classrooms;
      }
      const classes = await staffService.getClassrooms(
        ctx.session.user.id,
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
    .query(async ({ input, ctx }) => {
      const students = await classroomService.getStudents(input);
      if (ctx.session.user.profile === "student") {
        return students.filter(
          (student) => student.userId === ctx.session.user.id,
        );
      } else if (ctx.session.user.profile === "contact") {
        const contact = await contactService.getFromUserId(ctx.session.user.id);
        const studs = await contactService.getStudents(contact.id);
        const studentIds = studs.map((s) => s.studentId);
        return students.filter((student) => studentIds.includes(student.id));
      }
      return students;
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

  subjects: protectedProcedure.input(z.string().min(1)).query(({ input }) => {
    return classroomService.getSubjects(input);
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
              status: TransactionStatus.VALIDATED,
            },
          },
          student: {
            include: {
              user: true,
            },
          },
        },
      });

      return result.map((account) => {
        const balance = account.transactions.reduce((acc, transaction) => {
          return acc + transaction.amount;
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
