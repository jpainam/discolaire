import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

export const directoryRouter = {
  all: protectedProcedure
    .input(z.object({ q: z.string().optional().default("") }))
    .query(async ({ ctx, input }) => {
      const directories: {
        userId: string | null;
        firstName: string | null;
        lastName: string | null;
        phoneNumber1: string | null;
        phoneNumber2: string | null;
        email: string | null;
      }[] = [];
      const qq = `%${input.q}%`;
      const contacts = await ctx.db.contact.findMany({
        orderBy: { lastName: "asc" },
        take: 10,
        where: {
          schoolId: ctx.schoolId,
          OR: [
            { firstName: { contains: qq, mode: "insensitive" } },
            { email: { contains: qq, mode: "insensitive" } },
            { lastName: { contains: qq, mode: "insensitive" } },
          ],
        },
      });
      for (const contact of contacts) {
        directories.push({
          userId: contact.userId,
          firstName: contact.firstName,
          lastName: contact.lastName,
          phoneNumber1: contact.phoneNumber1,
          phoneNumber2: contact.phoneNumber2,
          email: contact.email,
        });
      }
      const students = await ctx.db.student.findMany({
        take: 10,
        orderBy: { lastName: "asc" },
        where: {
          schoolId: ctx.schoolId,
          OR: [
            { firstName: { contains: qq, mode: "insensitive" } },
            { lastName: { contains: qq, mode: "insensitive" } },
            { email: { contains: qq, mode: "insensitive" } },
            { registrationNumber: { contains: qq, mode: "insensitive" } },
          ],
        },
      });
      for (const student of students) {
        directories.push({
          userId: student.userId,
          firstName: student.firstName,
          lastName: student.lastName,
          phoneNumber1: student.phoneNumber,
          phoneNumber2: null,
          email: student.email,
        });
      }
      const staffs = await ctx.db.staff.findMany({
        orderBy: { lastName: "asc" },
        take: 10,
        where: {
          schoolId: ctx.schoolId,
          OR: [
            { firstName: { contains: qq, mode: "insensitive" } },
            { lastName: { contains: qq, mode: "insensitive" } },
            { email: { contains: qq, mode: "insensitive" } },
          ],
        },
      });
      for (const staff of staffs) {
        directories.push({
          userId: staff.userId,
          firstName: staff.firstName,
          lastName: staff.lastName,
          phoneNumber1: staff.phoneNumber1,
          phoneNumber2: staff.phoneNumber2,
          email: staff.email,
        });
      }
      return directories;
    }),
} satisfies TRPCRouterRecord;
