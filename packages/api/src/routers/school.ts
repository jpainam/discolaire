import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { Prisma } from "@repo/db";

import { protectedProcedure } from "../trpc";

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
  logo: z.string().optional(),
  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date().default(() => new Date()),
  isActive: z.boolean().default(true),
  address: z.string().optional(),
});
export const schoolRouter = {
  all: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.school.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }),
  getSchool: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.school.findUniqueOrThrow({
      where: {
        id: ctx.schoolId,
      },
    });
  }),
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.school.findUniqueOrThrow({
      include: {
        requiredJournals: true,
      },
      where: {
        id: input,
      },
    });
  }),

  delete: protectedProcedure
    .input(z.union([z.string().min(1), z.array(z.string().min(1))]))
    .mutation(() => {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You are not allowed to delete a school",
      });
      // return ctx.db.school.deleteMany({
      //   where: {
      //     id: {
      //       in: Array.isArray(input) ? input : [input],
      //     },
      //   },
      // });
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

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        code: z.string().min(1),
        registrationPrefix: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.school.create({
        data: {
          ...input,
          currency: "CFA",
        },
      });
    }),
  updateDefaultSettings: protectedProcedure
    .input(
      z.object({
        schoolId: z.string().min(1),
        defaultCountryId: z.string().min(1),
        applyRequiredFee: z.enum(["NO", "YES", "PASSIVE"]),
        includeRequiredFee: z.boolean(),
        allowOverEnrollment: z.boolean().default(true),
        currency: z.string().min(1),
        numberOfReceipts: z.coerce.number().min(1),
        requiredJournals: z.string().array().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const data = {
        numberOfReceipts: input.numberOfReceipts,
        defaultCountryId: input.defaultCountryId,
        applyRequiredFee: input.applyRequiredFee,
        allowOverEnrollment: input.allowOverEnrollment,
        includeRequiredFee: input.includeRequiredFee,
        currency: input.currency,
      } as Prisma.SchoolUpdateInput;

      const school = await ctx.db.school.update({
        where: {
          id: input.schoolId,
        },
        data: data,
      });
      if (input.requiredJournals) {
        await ctx.db.requiredAccountingJournal.deleteMany({
          where: {
            schoolId: input.schoolId,
          },
        });
        await ctx.db.requiredAccountingJournal.createMany({
          data: input.requiredJournals.map((journal) => ({
            schoolId: input.schoolId,
            journalId: journal,
          })),
        });
      }
      return school;
    }),
} satisfies TRPCRouterRecord;
