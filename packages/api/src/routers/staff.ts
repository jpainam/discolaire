import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, publicProcedure } from "../trpc";

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
  email: z.string().email(),
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
  hello: publicProcedure.query(() => {
    return { hello: "world" };
  }),
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.staff.findMany({
      include: {
        country: true,
        degree: true,
      },
      orderBy: {
        lastName: "asc",
      },
    });
  }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.staff.findUnique({
        where: {
          id: input.id,
        },
        include: {
          country: true,
          degree: true,
        },
      });
    }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.staff.delete({
      where: {
        id: input,
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
  levels: protectedProcedure.query(({ ctx }) => {
    return ctx.db.degree.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }),
  create: protectedProcedure
    .input(createUpdateSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.staff.create({
        data: input,
      });
    }),
  deleteMany: protectedProcedure
    .input(z.array(z.string()))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.staff.deleteMany({
        where: {
          id: {
            in: input,
          },
        },
      });
    }),
  update: protectedProcedure
    .input(createUpdateSchema.extend({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.staff.update({
        where: {
          id: id,
        },
        data: data,
      });
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
} satisfies TRPCRouterRecord;
