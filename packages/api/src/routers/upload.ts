import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const uploadRouter = {
  matchedIds: protectedProcedure
    .input(
      z.object({
        entityType: z.enum(["staff", "contact", "student"]),
        entityIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.entityType === "staff") {
        const data = await ctx.db.staff.findMany({
          where: {
            lastName: {
              in: input.entityIds,
            },
          },
        });
        return data.map((staff) => ({
          id: staff.id,
          name: `${staff.firstName} ${staff.lastName}`,
        }));
      } else if (input.entityType === "contact") {
        const data = await ctx.db.contact.findMany({
          where: {
            lastName: {
              in: input.entityIds,
            },
          },
        });
        return data.map((contact) => ({
          id: contact.id,
          name: `${contact.firstName} ${contact.lastName}`,
        }));
      }
      const data = await ctx.db.student.findMany({
        where: {
          registrationNumber: {
            in: input.entityIds,
          },
        },
      });
      return data.map((student) => ({
        id: student.id,
        name: student.registrationNumber,
      }));
    }),
} satisfies TRPCRouterRecord;
