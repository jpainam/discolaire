import { z } from "zod";

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
  logo: z.string().optional(),
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
  create: protectedProcedure
    .input(createSchoolSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.school.create({
        data: input,
      });
    }),
});
