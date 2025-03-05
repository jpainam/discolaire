import { subMonths } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { hashPassword } from "@repo/auth/session";

import { userService } from "../services/user-service";
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
      return ctx.db.$transaction(
        async (tx) => {
          const contacts = await tx.contact.findMany({
            where: {
              schoolId: ctx.schoolId,
              id: {
                in: Array.isArray(input) ? input : [input],
              },
            },
          });
          await tx.contact.deleteMany({
            where: {
              schoolId: ctx.schoolId,
              id: {
                in: Array.isArray(input) ? input : [input],
              },
            },
          });
          await userService.deleteUsers(
            contacts.map((c) => c.userId).filter((t) => t !== null),
          );
          return true;
        },
        {
          maxWait: 5000,
          timeout: 20000,
        },
      );
    }),
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.contact.findUnique({
      include: {
        user: {
          include: {
            roles: true,
          },
        },
      },
      where: {
        id: input,
      },
    });
  }),

  all: protectedProcedure
    .input(
      z.object({
        // per_page: z.coerce.number().optional().default(30),
        // page: z.coerce.number().optional().default(1),
        // sort: z.string().optional().default("lastName"),
        q: z.string().optional().default(""),
      }),
    )
    .query(async ({ ctx, input }) => {
      //const offset = (input.page - 1) * input.per_page;
      const qq = `%${input.q}%`;
      return ctx.db.contact.findMany({
        //skip: offset,
        take: 30, //input.per_page,
        where: {
          schoolId: ctx.schoolId,
          OR: [
            { firstName: { startsWith: qq, mode: "insensitive" } },
            { lastName: { startsWith: qq, mode: "insensitive" } },
            { phoneNumber1: { startsWith: qq, mode: "insensitive" } },
            { phoneNumber2: { startsWith: qq, mode: "insensitive" } },
            { email: { startsWith: qq, mode: "insensitive" } },
            { employer: { startsWith: qq, mode: "insensitive" } },
            { title: { startsWith: qq, mode: "insensitive" } },
          ],
        },
        orderBy: {
          lastName: "asc",
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
    const result = await ctx.db.contact.count({
      where: {
        schoolId: ctx.schoolId,
      },
    });
    const newContacts = await ctx.db.contact.count({
      where: {
        schoolId: ctx.schoolId,
        createdAt: { gte: subMonths(new Date(), 1) },
      },
    });
    return { total: result, new: newContacts };
  }),
  selector: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.contact.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
      orderBy: {
        lastName: "asc",
      },
    });
  }),
  search: protectedProcedure
    .input(z.object({ query: z.string().optional().default("") }))
    .query(async ({ ctx, input }) => {
      const q = `%${input.query}%`;
      return ctx.db.contact.findMany({
        where: {
          schoolId: ctx.schoolId,
          OR: [
            { firstName: { startsWith: q } },
            { lastName: { startsWith: q } },
            { phoneNumber1: { startsWith: q } },
            { phoneNumber2: { startsWith: q } },
            { email: { startsWith: q } },
            { employer: { startsWith: q } },
            { title: { startsWith: q } },
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
        password: await hashPassword("password"),
        schoolId: ctx.schoolId,
        profile: "contact",
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
      void userService.sendWelcomeEmail({ email: input.email });
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
          schoolId: ctx.schoolId,
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
