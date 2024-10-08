import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { Prisma } from "@repo/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const createSchoolSchema = z.object({
  name: z.string().min(1),
  authorization: z.string().optional(),
  ministry: z.string().optional(),
  department: z.string().optional(),
  region: z.string().optional(),
  city: z.string().optional(),
  headmaster: z.string().optional(),
  phoneNumber1: z.string().optional(),
  phoneNumber2: z.string().optional(),
  email: z.string().optional(),
  website: z.string().optional(),
  //logo: z.string().optional(),
  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date().default(() => new Date()),
  isActive: z.boolean().default(true),
  address: z.string().optional(),
});
export const schoolRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.school.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }),
  getSchool: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.school.findUnique({
      where: {
        id: ctx.schoolId,
      },
    });
  }),
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.school.findUnique({
      where: {
        id: input,
      },
    });
  }),

  delete: protectedProcedure
    .input(z.union([z.string().min(1), z.array(z.string().min(1))]))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.school.deleteMany({
        where: {
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
    }),
  update: protectedProcedure
    .input(createSchoolSchema.extend({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.school.update({
        where: {
          id: input.id,
        },
        data: input,
      });
    }),
  updateLogo: protectedProcedure
    .input(z.object({ id: z.string().min(1), logo: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.school.update({
        where: {
          id: input.id,
        },
        data: {
          logo: input.logo,
        },
      });
    }),
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1), code: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.school.create({
        data: input,
      });
    }),
  updateDefaultSettings: protectedProcedure
    .input(
      z.object({
        schoolId: z.string().min(1),
        countryId: z.string().optional(),
        applyRequiredFee: z.enum(["NO", "YES", "PASSIVE"]).optional(),
        includeRequiredFee: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const data = {} as Prisma.SchoolUpdateInput;
      if (input.countryId !== undefined) {
        data.defaultCountryId = input.countryId;
      }
      if (input.applyRequiredFee !== undefined) {
        data.applyRequiredFee = input.applyRequiredFee;
      }
      if (input.includeRequiredFee !== undefined) {
        data.includeRequiredFee = input.includeRequiredFee;
      }
      if (Object.keys(data).length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No data to update",
        });
      }
      return ctx.db.school.update({
        where: {
          id: input.schoolId,
        },
        data: data,
      });
    }),
});
