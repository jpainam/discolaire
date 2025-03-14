import { subMonths } from "date-fns";
import { z } from "zod";

import redisClient from "@repo/kv";

import { checkPermission } from "../permission";
import { contactService } from "../services/contact-service";
import { studentService } from "../services/student-service";
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
  lastAccessed: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.contact.findMany({
        take: input.limit,
        where: {
          schoolId: ctx.schoolId,
        },
        orderBy: {
          lastAccessed: "desc",
        },
      });
    }),
  delete: protectedProcedure
    .input(z.union([z.string(), z.array(z.string())]))
    .mutation(async ({ ctx, input }) => {
      if (Array.isArray(input)) {
        void Promise.all(
          input.map((id) => redisClient.del(`contact:${id}:students`)),
        );
      } else {
        void redisClient.del(`contact:${input}:students`);
      }
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

  classrooms: protectedProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      return contactService.getClassrooms(input, ctx.schoolYearId);
    }),
  getFromUserId: protectedProcedure
    .input(z.string().min(1))
    .query(async ({ input }) => {
      return contactService.getFromUserId(input);
    }),
  all: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session.user.profile == "contact") {
      const contact = await contactService.getFromUserId(ctx.session.user.id);
      const c = await ctx.db.contact.findUniqueOrThrow({
        where: {
          id: contact.id,
        },
      });
      return [c];
    }
    if (ctx.session.user.profile == "student") {
      const student = await studentService.getFromUserId(ctx.session.user.id);
      const studentContacts = await ctx.db.studentContact.findMany({
        where: {
          studentId: student.id,
        },
      });
      const contactIds = studentContacts.map((sc) => sc.contactId);
      return ctx.db.contact.findMany({
        where: {
          id: {
            in: contactIds,
          },
        },
      });
    }

    const canReadStaff = await checkPermission("staff", "Read");
    if (!canReadStaff) {
      return ctx.db.contact.findMany({
        where: {
          schoolId: ctx.schoolId,
        },
        orderBy: {
          lastName: "asc",
        },
      });
    }
    return [];
  }),
  students: protectedProcedure
    .input(z.string().min(1))
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
      void redisClient.del(`contact:${input}:students`); // Clear old cache
      void redisClient.sadd(`contact:${input}:students`, ...studentIds);

      // const studentIds2 = await redisClient.smembers(
      //   `contact:${input}:students`,
      // );

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
    .input(
      z.object({
        limit: z.number().optional().default(30),
        query: z.string().optional().default(""),
      }),
    )
    .query(async ({ ctx, input }) => {
      const q = `%${input.query}%`;
      return ctx.db.contact.findMany({
        take: input.limit,
        orderBy: {
          lastName: "asc",
        },
        where: {
          schoolId: ctx.schoolId,
          OR: [
            { firstName: { startsWith: q, mode: "insensitive" } },
            { lastName: { startsWith: q, mode: "insensitive" } },
            { phoneNumber1: { startsWith: q, mode: "insensitive" } },
            { phoneNumber2: { startsWith: q, mode: "insensitive" } },
            { email: { startsWith: q, mode: "insensitive" } },
            { employer: { startsWith: q, mode: "insensitive" } },
            { title: { startsWith: q, mode: "insensitive" } },
          ],
        },
      });
    }),
  create: protectedProcedure
    .input(createUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await userService.createAutoUser({
        name: `${input.firstName} ${input.lastName}`,
        profile: "contact",
        schoolId: ctx.schoolId,
      });
      const contact = await ctx.db.contact.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          userId: user.id,
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
