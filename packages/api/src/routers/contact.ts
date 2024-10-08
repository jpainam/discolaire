import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { encryptPassword } from "../encrypt";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const createUpdateSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  title: z.string().optional(),
  employer: z.string().optional(),
  gender: z.enum(["male", "female"]).default("male"),
  isActive: z.boolean().default(true),
  observation: z.string().optional(),
  prefix: z.string().optional(),
  phoneNumber1: z.string().min(1),
  address: z.string().optional(),
  phoneNumber2: z.string().optional(),
});
export const contactRouter = createTRPCRouter({
  delete: protectedProcedure
    .input(z.union([z.string(), z.array(z.string())]))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.contact.deleteMany({
        where: {
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
    }),
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.contact.findUnique({
      where: {
        id: input,
      },
    });
  }),
  all: protectedProcedure
    .input(
      z.object({
        per_page: z.coerce.number().optional().default(20),
        page: z.coerce.number().optional().default(1),
        sort: z.string().optional().default("lastName"),
        q: z.string().optional().default(""),
      }),
    )
    .query(async ({ ctx, input }) => {
      const offset = (input.page - 1) * input.per_page;
      return ctx.db.contact.findMany({
        skip: offset,
        take: input.per_page,
        where: {
          schoolId: ctx.schoolId,
          OR: [
            { firstName: { startsWith: `%${input.q}%` } },
            { lastName: { startsWith: `%${input.q}%` } },
            { phoneNumber1: { startsWith: `%${input.q}%` } },
            { phoneNumber2: { startsWith: `%${input.q}%` } },
            { email: { startsWith: `%${input.q}%` } },
            { employer: { startsWith: `%${input.q}%` } },
            { title: { startsWith: `%${input.q}%` } },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
  students: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const std = await ctx.db.studentContact.findMany({
        where: {
          contactId: input,
        },
        include: {
          contact: true,
          relationship: true,
        },
      });
      const studentIds = std.map((s) => s.studentId);
      const students = await ctx.db.student.findMany({
        where: {
          id: {
            in: studentIds,
          },
        },
      });

      const result = await Promise.all(
        std.map(async (stud) => {
          const lastEnrollment = await ctx.db.enrollment.findFirst({
            where: {
              studentId: stud.studentId,
            },
            orderBy: {
              schoolYearId: "desc",
            },
          });
          const classroom = await ctx.db.classroom.findFirst({
            where: {
              enrollments: {
                some: {
                  id: lastEnrollment?.id,
                },
              },
            },
          });
          return {
            ...stud,
            student: {
              ...students.find((r) => r.id === stud.studentId),
              enrollment: lastEnrollment,
              classroom: classroom,
            },
          };
        }),
      );
      return result;
    }),
  count: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.contact.count();
  }),
  selector: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.contact.findMany({
      orderBy: {
        lastName: "asc",
      },
    });
  }),
  search: protectedProcedure
    .input(z.object({ q: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.contact.findMany({
        where: {
          OR: [
            { firstName: { startsWith: `%${input.q}%` } },
            { lastName: { startsWith: `%${input.q}%` } },
            { phoneNumber1: { startsWith: `%${input.q}%` } },
            { phoneNumber2: { startsWith: `%${input.q}%` } },
            { email: { startsWith: `%${input.q}%` } },
            { employer: { startsWith: `%${input.q}%` } },
            { title: { startsWith: `%${input.q}%` } },
          ],
        },
      });
    }),
  create: protectedProcedure
    .input(createUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const contact = await ctx.db.contact.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          title: input.title,
          gender: input.gender,
          employer: input.employer,
          isActive: input.isActive,
          observation: input.observation,
          prefix: input.prefix,
          address: input.address,
          phoneNumber1: input.phoneNumber1,
          phoneNumber2: input.phoneNumber2,
          schoolId: ctx.schoolId,
        },
      });
      // create user
      const userData = {
        username: uuidv4(),
        password: await encryptPassword("password"),
        schoolId: ctx.schoolId,
        name: `${contact.firstName} ${contact.lastName}`,
      };
      const user = await ctx.db.user.create({
        data: userData,
      });
      await ctx.db.contact.update({
        where: {
          id: contact.id,
        },
        data: {
          userId: user.id,
        },
      });
      return contact;
    }),
  update: protectedProcedure
    .input(createUpdateSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.contact.update({
        where: {
          id: input.id,
        },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          gender: input.gender,
          title: input.title,
          employer: input.employer,
          isActive: input.isActive,
          observation: input.observation,
          prefix: input.prefix,
          address: input.address,
          phoneNumber1: input.phoneNumber1,
          phoneNumber2: input.phoneNumber2,
        },
      });
    }),
  unlinkedStudents: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(10),
        page: z.number().optional().default(1),
        q: z.string().optional(),
        contactId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const qq = `%${input.q}%`;
      return ctx.db.student.findMany({
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
                { residence: { startsWith: qq, mode: "insensitive" } },
                { phoneNumber: { startsWith: qq, mode: "insensitive" } },
                { email: { startsWith: qq, mode: "insensitive" } },
                { registrationNumber: { startsWith: qq, mode: "insensitive" } },
              ],
            },
            {
              studentContacts: {
                none: {
                  contactId: input.contactId,
                },
              },
            },
          ],
        },
      });
    }),
});
