import type { TRPCRouterRecord } from "@trpc/server";
import { headers } from "next/headers";
import { subMonths } from "date-fns";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";
import { getFullName } from "../utils";

const createUpdateSchema = z.object({
  prefix: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string().optional(),
  isActive: z.boolean().default(true),
  jobTitle: z.string().optional(),
  employmentType: z.string().optional(),
  dateOfHire: z.coerce.date().optional(),
  dateOfRelease: z.coerce.date().optional(),
  placeOfBirth: z.string().optional(),
  bloodType: z.string().optional(),
  dateOfBirth: z.coerce.date().optional(),
  isTeacher: z.boolean().default(false),
  gender: z.enum(["female", "male"]).default("male"),
  phoneNumber1: z.string().optional(),
  phoneNumber2: z.string().optional(),
  email: z.email().optional().or(z.literal("")),
  observation: z.string().optional(),
  dateOfLastAdvancement: z.coerce.date().optional(),
  dateOfCriminalRecordCheck: z.coerce.date().optional(),
  sendAgendaFrequency: z.string().optional(),
  address: z.string().optional(),
  countryId: z.string().optional(),
  degreeId: z.string().optional(),
  specialty: z.string().optional(),
  weeklyWorkingHours: z.coerce.number().int().min(1).max(168).optional(),
  baseSalary: z.number().optional(),
  travelAllowance: z.number().optional(),
  phoneAllowance: z.number().optional(),
  housingAllowance: z.number().optional(),
  transportAllowance: z.number().optional(),
  performanceBonus: z.number().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  bankCode: z.string().optional(),
  cnps: z.string().optional(),
  cnss: z.string().optional(),
  tax: z.string().optional(),
});
export const staffRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.staff.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
      include: {
        country: true,
        degree: true,
        user: true,
      },
      orderBy: {
        lastName: "asc",
      },
    });
  }),
  get: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.staff.findUniqueOrThrow({
      where: {
        id: input,
      },
      include: {
        country: true,
        degree: true,
        user: true,
      },
    });
  }),
  delete: protectedProcedure
    .input(z.union([z.string(), z.array(z.string())]))
    .mutation(async ({ ctx, input }) => {
      const staffIds = Array.isArray(input) ? input : [input];

      const staffs = await ctx.db.staff.findMany({
        where: {
          schoolId: ctx.schoolId,
          id: {
            in: staffIds,
          },
        },
      });
      const userIds = staffs.map((c) => c.userId).filter((u) => u != null);
      if (userIds.length > 0) {
        await ctx.db.user.deleteMany({
          where: {
            id: {
              in: userIds,
            },
          },
        });
      }
      await ctx.pubsub.publish("staff", {
        type: "delete",
        data: {
          id: staffIds.join(","),
        },
      });
      return ctx.db.staff.deleteMany({
        where: {
          schoolId: ctx.schoolId,
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
    }),
  teachers: protectedProcedure.query(({ ctx }) => {
    return ctx.db.staff.findMany({
      where: {
        isTeacher: true,
      },
    });
  }),
  jobTitles: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.staff.findMany({
      distinct: ["jobTitle"],
      where: {
        jobTitle: {
          not: null,
        },
      },
      select: {
        jobTitle: true,
      },
    });
    return result.map((item) => item.jobTitle);
  }),

  create: protectedProcedure
    .input(createUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const staff = await ctx.db.staff.create({
        data: {
          ...input,
          email: input.email,
          dateOfBirth: input.dateOfBirth,
          schoolId: ctx.schoolId,
        },
      });
      await ctx.pubsub.publish("staff", {
        type: "create",
        data: {
          id: staff.id,
          metadata: {
            name: input.lastName,
          },
        },
      });
      return staff;
    }),

  update: protectedProcedure
    .input(createUpdateSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const staff = await ctx.db.staff.update({
        where: {
          id: id,
        },
        include: {
          user: true,
        },
        data: {
          ...data,
        },
      });

      if (staff.userId && input.email && staff.user?.email !== input.email) {
        await ctx.authApi.adminUpdateUser({
          body: {
            userId: staff.userId,
            data: { email: input.email, name: getFullName(staff) },
          },
          headers: await headers(),
        });
      }
      await ctx.pubsub.publish("staff", {
        type: "update",
        data: {
          id: id,
          metadata: {
            name: data.lastName,
          },
        },
      });
      return staff;
    }),
  count: protectedProcedure
    .input(
      z
        .object({
          q: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx }) => {
      const staffs = await ctx.db.staff.findMany({
        where: { schoolId: ctx.schoolId },
      });
      const female = staffs.filter((stf) => stf.gender == "female").length;
      const male = staffs.length - female;
      const newStaffs = await ctx.db.staff.count({
        where: {
          schoolId: ctx.schoolId,
          createdAt: { gte: subMonths(new Date(), 1) },
        },
      });
      return { total: staffs.length, new: newStaffs, female, male };
    }),
  timelines: protectedProcedure.input(z.string()).query(() => {
    return [
      // generate 10 random timelines
      ...Array.from({ length: 10 }, (_, i) => ({
        id: i.toString(),
        title: `Timeline ${i}`,
        description: `Description ${i}`,
        date: new Date(),
      })),
    ];
  }),
  activities: protectedProcedure
    .input(
      z.object({
        staffId: z.string().min(1),
        limit: z.number().min(1).max(100).optional().default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const staff = await ctx.db.staff.findUniqueOrThrow({
        where: {
          id: input.staffId,
        },
        select: {
          userId: true,
        },
      });
      if (!staff.userId) {
        return [];
      }
      const logs = await ctx.db.logActivity.findMany({
        where: {
          schoolId: ctx.schoolId,
          userId: staff.userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: input.limit,
      });
      return ctx.services.logActivity.formatLogActivities(logs);
    }),
  gradesheets: protectedProcedure
    .input(z.string().min(2))
    .query(({ ctx, input }) => {
      return ctx.db.gradeSheet.findMany({
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          termId: true,
          term: {
            select: {
              name: true,
            },
          },
          createdAt: true,
          grades: {
            select: {
              grade: true,
              isAbsent: true,
            },
          },
          subject: {
            include: {
              course: true,
              classroom: {
                select: {
                  reportName: true,
                },
              },
            },
          },
          createdBy: {
            select: {
              name: true,
              username: true,
            },
          },
        },
        where: {
          subject: {
            teacherId: input,
            classroom: {
              schoolYearId: ctx.schoolYearId,
            },
          },
        },
      });
    }),
  subjects: protectedProcedure
    .input(z.string().min(1))
    .query(({ ctx, input }) => {
      return ctx.services.staff.getSubjects(input, ctx.schoolYearId);
    }),
  documents: protectedProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      return ctx.db.document.findMany({
        where: {
          staffId: input,
        },
        include: {
          createdBy: true,
          staff: true,
        },
      });
    }),
  getFromUserId: protectedProcedure
    .input(z.string())
    .query(({ input, ctx }) => {
      return ctx.services.staff.getFromUserId(input);
    }),
  classrooms: protectedProcedure
    .input(
      z.object({ staffId: z.string(), schoolYearId: z.string().optional() }),
    )
    .query(({ ctx, input }) => {
      return ctx.services.staff.getClassrooms(
        input.staffId,
        input.schoolYearId ?? ctx.schoolYearId,
      );
    }),

  students: protectedProcedure
    .input(z.string().min(1))
    .query(({ ctx, input }) => {
      return ctx.services.staff.getStudents(input, ctx.schoolYearId);
    }),

  permissions: protectedProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      const staff = await ctx.db.staff.findUniqueOrThrow({
        where: {
          id: input,
        },
      });
      if (!staff.userId) {
        // throw new TRPCError({
        //   code: "PRECONDITION_FAILED",
        //   message: "Le staff n'est pas de compte utilisateur",
        // });
        return [];
      }
      return ctx.services.user.getPermissions(staff.userId);
    }),
  attendances: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.staffAttendance.findMany({
      orderBy: {
        date: "desc",
      },
      include: {
        createdBy: true,
      },
      where: {
        id: input,
      },
    });
  }),
  stats: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const classrooms = await ctx.services.staff.getClassrooms(
      input,
      ctx.schoolYearId,
    );

    const subjects = await ctx.services.staff.getSubjects(
      input,
      ctx.schoolYearId,
    );

    const students = await ctx.services.staff.getStudents(
      input,
      ctx.schoolYearId,
    );
    return {
      classrooms: classrooms.length,
      students: students.length,
      subjects: subjects.length,
      gradesheets: subjects
        .map((s) => s._count.gradeSheets)
        .reduce((prev, curr) => prev + curr, 0),
    };
  }),
} satisfies TRPCRouterRecord;
