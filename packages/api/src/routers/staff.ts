import type { TRPCRouterRecord } from "@trpc/server";
import { subMonths } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { z } from "zod/v4";

import { staffService } from "../services";
import { createUser } from "../services/user-service";
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
  dateOfBirth: z.coerce.date().optional(),
  isTeacher: z.boolean().default(false),
  gender: z.enum(["female", "male"]).default("male"),
  phoneNumber1: z.string().optional(),
  phoneNumber2: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  observation: z.string().optional(),
  dateOfLastAdvancement: z.coerce.date().optional(),
  dateOfCriminalRecordCheck: z.coerce.date().optional(),
  sendAgendaFrequency: z.string().optional(),
  address: z.string().optional(),
  countryId: z.string().optional(),
  degreeId: z.string().optional(),
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
      const { email, ...data } = input;
      const staff = await ctx.db.staff.create({
        data: {
          ...data,
          dateOfBirth: input.dateOfBirth
            ? fromZonedTime(input.dateOfBirth, "UTC")
            : undefined,
          schoolId: ctx.schoolId,
        },
      });
      if (email) {
        await createUser({
          email,
          entityId: staff.id,
          username: getFullName(staff)
            .replace(/[^a-zA-Z0-9]/g, "")
            .toLowerCase(),
          authApi: ctx.authApi,
          schoolId: ctx.schoolId,
          name: getFullName(staff),
          profile: "staff",
          isActive: true,
        });
      }
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
      const { id, email, ...data } = input;

      const staff = await ctx.db.staff.findUniqueOrThrow({
        where: {
          id: id,
        },
        include: {
          user: true,
        },
      });
      if (email && staff.user?.email !== email) {
        if (staff.user) {
          // If the email is changed, we need to update the user email as well
          await ctx.db.user.update({
            where: {
              id: staff.user.id,
            },
            data: {
              email: email,
            },
          });
        } else {
          await createUser({
            email,
            entityId: id,
            username: getFullName(staff)
              .replace(/[^a-zA-Z0-9]/g, "")
              .toLowerCase(),
            authApi: ctx.authApi,
            schoolId: ctx.schoolId,
            name: getFullName(staff),
            profile: "staff",
            isActive: true,
          });
        }
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
      return ctx.db.staff.update({
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
  getFromUserId: protectedProcedure.input(z.string()).query(({ input }) => {
    return staffService.getFromUserId(input);
  }),
  classrooms: protectedProcedure
    .input(
      z.object({ staffId: z.string(), schoolYearId: z.string().optional() }),
    )
    .query(({ ctx, input }) => {
      return staffService.getClassrooms(
        input.staffId,
        input.schoolYearId ?? ctx.schoolYearId,
      );
    }),

  students: protectedProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      return staffService.getStudents(input, ctx.schoolYearId);
    }),
} satisfies TRPCRouterRecord;
