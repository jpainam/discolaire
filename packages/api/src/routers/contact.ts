import type { TRPCRouterRecord } from "@trpc/server";
import { subMonths } from "date-fns";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

const createUpdateSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  occupation: z.string().optional(),
  employer: z.string().optional(),
  gender: z.enum(["male", "female"]).default("male"),
  isActive: z.boolean().default(true),
  observation: z.string().optional(),
  prefix: z.string().optional(),
  phoneNumber1: z.string().min(1),
  address: z.string().optional(),
  phoneNumber2: z.string().optional(),
  email: z.string().optional(),
});
export const contactRouter = {
  delete: protectedProcedure
    .input(z.union([z.string(), z.array(z.string())]))
    .mutation(async ({ ctx, input }) => {
      const contacts = await ctx.db.contact.findMany({
        where: {
          schoolId: ctx.schoolId,
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
      const userIds = contacts.map((c) => c.userId).filter((u) => u != null);
      if (userIds.length > 0) {
        await ctx.db.user.deleteMany({
          where: {
            id: {
              in: userIds,
            },
          },
        });
      }
      return ctx.db.contact.deleteMany({
        where: {
          schoolId: ctx.schoolId,
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
    }),
  get: protectedProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      await ctx.db.contact.update({
        where: {
          id: input,
        },
        data: {
          lastAccessed: new Date(),
        },
      });
      return ctx.db.contact.findUniqueOrThrow({
        include: {
          user: true,
        },
        where: {
          id: input,
        },
      });
    }),

  classrooms: protectedProcedure
    .input(z.string().min(1))
    .query(({ ctx, input }) => {
      return ctx.services.contact.getClassrooms(
        input,
        ctx.schoolYearId,
        ctx.schoolId,
      );
    }),
  getFromUserId: protectedProcedure
    .input(z.string().min(1))
    .query(({ input, ctx }) => {
      return ctx.services.contact.getFromUserId(input);
    }),
  students: protectedProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      const std = await ctx.db.studentContact.findMany({
        where: {
          contactId: input,
        },
        include: {
          contact: {
            include: {
              user: true,
            },
          },
          relationship: true,
        },
      });
      const studentIds = std.map((s) => s.studentId);

      const students = await ctx.db.student.findMany({
        include: {
          user: true,
        },
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

  all: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().optional().default(100),
          query: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const q = input?.query;
      if (ctx.session.user.profile == "contact") {
        const contact = await ctx.services.contact.getFromUserId(
          ctx.session.user.id,
        );
        const c = await ctx.db.contact.findUniqueOrThrow({
          include: {
            user: true,
            studentContacts: {
              include: {
                student: true,
                relationship: true,
              },
            },
          },
          where: {
            id: contact.id,
          },
        });
        return [c];
      }
      if (ctx.session.user.profile == "student") {
        const student = await ctx.services.student.getFromUserId(
          ctx.session.user.id,
        );
        const studentContacts = await ctx.db.studentContact.findMany({
          where: {
            studentId: student.id,
          },
        });
        const contactIds = studentContacts.map((sc) => sc.contactId);
        return ctx.db.contact.findMany({
          include: {
            user: true,
            studentContacts: {
              include: { student: true, relationship: true },
            },
          },
          where: {
            id: {
              in: contactIds,
            },
          },
        });
      }
      return ctx.db.contact.findMany({
        take: input?.limit ?? 100,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
          studentContacts: {
            include: {
              student: true,
              relationship: true,
            },
          },
        },
        where: {
          schoolId: ctx.schoolId,
          OR: [
            { firstName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
            { phoneNumber1: { contains: q, mode: "insensitive" } },
            { phoneNumber2: { contains: q, mode: "insensitive" } },
            {
              user: {
                email: { contains: q, mode: "insensitive" },
              },
            },

            { employer: { contains: q, mode: "insensitive" } },
            { occupation: { contains: q, mode: "insensitive" } },
          ],
        },
      });
    }),
  create: protectedProcedure
    .input(createUpdateSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.contact.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          occupation: input.occupation,
          gender: input.gender,
          employer: input.employer,
          isActive: input.isActive,
          observation: input.observation,
          prefix: input.prefix,
          address: input.address,
          phoneNumber1: input.phoneNumber1,
          phoneNumber2: input.phoneNumber2,
          email: input.email,
          schoolId: ctx.schoolId,
        },
      });
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
          gender: input.gender,
          occupation: input.occupation,
          employer: input.employer,
          isActive: input.isActive,
          observation: input.observation,
          prefix: input.prefix,
          address: input.address,
          email: input.email,
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
        include: {
          user: true,
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
  documents: protectedProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      return ctx.db.document.findMany({
        where: {
          contactId: input,
        },
        include: {
          createdBy: true,
          contact: true,
        },
      });
    }),
} satisfies TRPCRouterRecord;
