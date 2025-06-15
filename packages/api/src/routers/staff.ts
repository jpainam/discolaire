import type { TRPCRouterRecord } from "@trpc/server";
import { subMonths } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { z } from "zod";

import { createUser } from "../services/user-service";
import { protectedProcedure } from "../trpc";

const createUpdateSchema = z.object({
  prefix: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string().optional(),
  isActive: z.boolean().default(true),
  jobTitle: z.string().optional(),
  employmentType: z.string().optional(),
  dateOfHire: z.coerce.date().optional(),
  dateOfBirth: z.coerce.date().optional(),
  isTeacher: z.boolean().default(false),
  gender: z.enum(["female", "male"]).default("male"),
  email: z.string().email().optional().or(z.literal("")),
  phoneNumber1: z.string().optional(),
  phoneNumber2: z.string().optional(),
  observation: z.string().optional(),
  dateOfLastAdvancement: z.coerce.date().optional(),
  dateOfCriminalRecordCheck: z.coerce.date().optional(),
  sendAgendaFrequency: z.string().optional(),
  address: z.string().optional(),
  countryId: z.string().optional(),
  degreeId: z.number().optional(),
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
        user: {
          include: {
            roles: true,
          },
        },
      },
    });
  }),
  delete: protectedProcedure
    .input(z.union([z.string(), z.array(z.string())]))
    .mutation(async ({ ctx, input }) => {
      const staffs = await ctx.db.staff.findMany({
        where: {
          schoolId: ctx.schoolId,
          id: {
            in: Array.isArray(input) ? input : [input],
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
          //userId: user.id,
          dateOfBirth: input.dateOfBirth
            ? fromZonedTime(input.dateOfBirth, "UTC")
            : undefined,
          schoolId: ctx.schoolId,
        },
      });
      await createUser({
        name: `${input.firstName} ${input.lastName}`,
        profile: "staff",
        username:
          `${input.firstName.toLowerCase()}.${input.lastName.toLowerCase()}`.replace(
            /[^a-zA-Z0-9]/g,
            "",
          ),
        email: input.email ?? "",
        schoolId: ctx.schoolId,
        entityId: staff.id,
        authApi: ctx.authApi,
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
        data: {
          ...data,
          dateOfBirth: data.dateOfBirth
            ? fromZonedTime(data.dateOfBirth, "UTC")
            : undefined,
        },
      });
      let userId = staff.userId;
      if (!userId) {
        const user = await createUser({
          name: `${input.firstName} ${input.lastName}`,
          profile: "staff",
          username:
            `${input.firstName.toLowerCase()}.${input.lastName.toLowerCase()}`.replace(
              /[^a-zA-Z0-9]/g,
              "",
            ),
          email: input.email,
          schoolId: ctx.schoolId,
          entityId: staff.id,
          authApi: ctx.authApi,
        });
        userId = user.id;
      }
      await ctx.db.user.update({
        where: {
          id: userId,
        },
        data: {
          name: `${input.firstName} ${input.lastName}`,
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
  teachings: protectedProcedure
    .input(z.string().min(1))
    .query(({ ctx, input }) => {
      return ctx.db.subject.findMany({
        orderBy: {
          classroomId: "asc",
        },
        where: {
          teacherId: input,
          classroom: {
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          },
        },
        include: {
          subjectGroup: true,
          course: true,
          classroom: true,
        },
      });
    }),
  documents: protectedProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      const staff = await ctx.db.staff.findUniqueOrThrow({
        where: {
          id: input,
        },
      });
      if (!staff.userId) {
        return [];
      }
      return ctx.db.document.findMany({
        where: {
          userId: staff.userId,
        },
        include: {
          createdBy: true,
        },
      });
    }),
} satisfies TRPCRouterRecord;
