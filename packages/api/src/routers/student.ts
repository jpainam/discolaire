import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { Prisma, Student } from "@repo/db";

import { studentService } from "../services/student-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const whereClause = (q: string): Prisma.StudentFindManyArgs => {
  const qq = `%${q}%`;
  return {
    where: {
      AND: [
        {
          OR: [
            { id: { startsWith: qq, mode: "insensitive" } },
            { firstName: { startsWith: qq, mode: "insensitive" } },
            { lastName: { startsWith: qq, mode: "insensitive" } },
            { residence: { startsWith: qq, mode: "insensitive" } },
            { phoneNumber: { startsWith: qq, mode: "insensitive" } },
            { email: { startsWith: qq, mode: "insensitive" } },
            { registrationNumber: { startsWith: qq, mode: "insensitive" } },
          ],
        },
      ],
    },
  };
};
const createUpdateSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.coerce.date(),
  placeOfBirth: z.string().min(1),
  gender: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  residence: z.string().optional(),
  phoneNumber: z.string().optional(),
  formerSchoolId: z.string().min(1),
  countryId: z.string().min(1),
  isBaptized: z.boolean().optional().default(false),
  religionId: z.string().optional(),
  dateOfEntry: z.coerce.date().optional(),
  dateOfExit: z.coerce.date().optional(),
  tags: z.array(z.string()).optional(),
  observation: z.string().optional(),
  socialMedias: z.array(z.string()).optional().default([]),
  clubs: z.array(z.string()).optional(),
  sports: z.array(z.string()).optional(),
  hobbies: z.array(z.string()).optional().default([]),
  status: z
    .enum(["ACTIVE", "GRADUATED", "INACTIVE", "EXPELLED"])
    .default("ACTIVE"),
});
export const studentRouter = createTRPCRouter({
  all: protectedProcedure
    .input(
      z.object({
        page: z.coerce.number().optional().default(1),
        per_page: z.coerce.number().optional().default(30),
        sort: z.string().optional().default("lastName"),
        q: z.string().optional(),
        formerSchool: z.boolean().optional().default(true),
        country: z.boolean().optional().default(true),
      }),
    )
    .query(async ({ ctx, input }) => {
      const offset = input.per_page * (input.page - 1);

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      const [column, order] = (input.sort?.split(".")?.filter(Boolean) ?? [
        "lastName",
        "desc",
      ]) as [keyof Student | undefined, "asc" | "desc" | undefined];

      const data = await ctx.db.student.findMany({
        skip: offset,
        take: input.per_page,
        orderBy: {
          [column ?? "lastName"]: order ?? "desc",
        },
        where: whereClause(input.q ?? "").where,
        include: {
          formerSchool: true,
          country: true,
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
            classroom: await studentService.classroom(
              student.id,
              ctx.schoolYearId,
            ),
          };
        }),
      );
      return students;
    }),
  create: protectedProcedure
    .input(createUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const student = await ctx.db.student.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          dateOfBirth: input.dateOfBirth,
          placeOfBirth: input.placeOfBirth,
          gender: input.gender,
          email: input.email,
          residence: input.residence,
          phoneNumber: input.phoneNumber,
          formerSchoolId: input.formerSchoolId,
          countryId: input.countryId,
          isBaptized: input.isBaptized,
          religionId: input.religionId,
          dateOfEntry: input.dateOfEntry,
          dateOfExit: input.dateOfEntry,
          tags: input.tags,
          observation: input.observation,
          status: input.status,
          hobbies: input.hobbies,
          createdById: ctx.session.user.id,
        },
      });
      void studentService.addClubs(student.id, input.clubs ?? []);
      void studentService.addSports(student.id, input.sports ?? []);
      return student;
    }),
  update: protectedProcedure
    .input(createUpdateSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      void studentService.addClubs(input.id, input.clubs ?? []);
      void studentService.addSports(input.id, input.sports ?? []);
      return ctx.db.student.update({
        where: { id: input.id },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          dateOfBirth: input.dateOfBirth,
          placeOfBirth: input.placeOfBirth,
          gender: input.gender,
          email: input.email,
          residence: input.residence,
          phoneNumber: input.phoneNumber,
          formerSchoolId: input.formerSchoolId,
          countryId: input.countryId,
          isBaptized: input.isBaptized,
          religionId: input.religionId,
          dateOfEntry: input.dateOfEntry,
          dateOfExit: input.dateOfEntry,
          tags: input.tags,
          observation: input.observation,
          status: input.status,
          hobbies: input.hobbies,
          createdById: ctx.session.user.id,
        },
      });
    }),
  count: protectedProcedure
    .input(
      z
        .object({
          q: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const students = await ctx.db.student.findMany({
        where: whereClause(input?.q ?? "").where,
      });
      const female = students.filter((std) => std.gender == "female").length;
      const male = students.length - female;
      return { total: students.length, female, male };
    }),
  contacts: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.studentContact.findMany({
      where: {
        studentId: input,
      },
      include: {
        contact: true,
        relationship: true,
      },
    });
  }),
  delete: protectedProcedure
    .input(z.union([z.string(), z.array(z.string())]))
    .mutation(({ ctx, input }) => {
      return ctx.db.student.deleteMany({
        where: {
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
    }),
  siblings: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.student.findMany({
        where: {
          siblings: {
            some: {
              studentId: input,
            },
          },
        },
      });
    }),

  classroom: protectedProcedure
    .input(
      z.object({ studentId: z.string(), schoolYearId: z.string().optional() }),
    )
    .query(({ ctx, input }) => {
      // return the current classroom
      if (input.schoolYearId) {
        return studentService.classroom(input.studentId, input.schoolYearId);
      }
      return studentService.classroom(input.studentId, ctx.schoolYearId);
    }),

  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const student = await ctx.db.student.findUnique({
      where: {
        id: input,
      },
      include: {
        formerSchool: true,
        sports: {
          include: {
            sport: true,
          },
        },
        clubs: {
          include: {
            club: true,
          },
        },
        country: true,
        religion: true,
        studentContacts: {
          include: {
            contact: true,
            relationship: true,
          },
        },
        enrollments: {
          include: {
            classroom: true,
          },
        },
        user: true,
      },
    });
    if (!student) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Student not found",
      });
    }
    const classroom = await studentService.classroom(input, ctx.schoolYearId);
    return {
      ...student,
      classroom: classroom,
    };
  }),
  selector: protectedProcedure.query(({ ctx }) => {
    return ctx.db.student.findMany({
      orderBy: {
        lastName: "asc",
      },
    });
  }),
  documents: protectedProcedure.input(z.string()).query(() => {
    return [];
  }),
  enrollments: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.enrollment.findMany({
      where: {
        studentId: input,
      },
      include: {
        student: true,
        classroom: true,
        schoolYear: true,
      },
      orderBy: {
        schoolYearId: "desc",
      },
    });
  }),
  grades: protectedProcedure
    .input(z.object({ id: z.string(), termId: z.coerce.number().optional() }))
    .query(({ ctx, input }) => {
      return studentService.getGrades({
        studentId: input.id,
        termId: input.termId,
        schoolYearId: ctx.schoolYearId,
      });
    }),
  unlinkedContacts: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(10),
        page: z.number().optional().default(1),
        q: z.string().optional(),
        studentId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const qq = `%${input.q}%`;
      return ctx.db.contact.findMany({
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
                { phoneNumber1: { startsWith: qq, mode: "insensitive" } },
                { phoneNumber2: { startsWith: qq, mode: "insensitive" } },
                { email: { startsWith: qq, mode: "insensitive" } },
              ],
            },
            {
              studentContacts: {
                none: {
                  studentId: input.studentId,
                },
              },
            },
          ],
        },
      });
    }),
  updateAvatar: protectedProcedure
    .input(z.object({ id: z.string(), avatar: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.student.update({
        data: {
          avatar: input.avatar,
        },
        where: {
          id: input.id,
        },
      });
      const student = await ctx.db.student.findUnique({
        where: {
          id: input.id,
        },
      });
      if (student?.userId) {
        await ctx.db.user.update({
          data: {
            avatar: input.avatar,
          },
          where: {
            id: student.userId,
          },
        });
      }
      return true;
    }),
  transactions: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.transaction.findMany({
      where: {
        account: {
          studentId: input,
        },
        deletedAt: null,
        schoolYearId: ctx.schoolYearId,
      },
      include: {
        journal: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
});
