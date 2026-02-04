import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

export const notificationRecipientRouter = {
  syncFromEntity: protectedProcedure
    .input(
      z.object({
        entityId: z.string().min(1),
        profile: z.enum(["student", "staff", "contact"]),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.services.notification.syncRecipientFromEntity({
        schoolId: ctx.schoolId,
        recipient: {
          entityId: input.entityId,
          profile: input.profile,
        },
      });
    }),
  updateContact: protectedProcedure
    .input(
      z
        .object({
          entityId: z.string().min(1),
          profile: z.enum(["student", "staff", "contact"]),
          primaryEmail: z.string().email().nullable().optional(),
          primaryPhone: z.string().nullable().optional(),
        })
        .refine(
          (value) =>
            value.primaryEmail !== undefined ||
            value.primaryPhone !== undefined,
          {
            message: "Provide primaryEmail or primaryPhone to update.",
          },
        ),
    )
    .mutation(async ({ ctx, input }) => {
      const recipient = await ctx.services.notification.ensureRecipient({
        schoolId: ctx.schoolId,
        recipient: {
          entityId: input.entityId,
          profile: input.profile,
        },
      });

      return ctx.db.notificationRecipient.update({
        where: {
          schoolId_profile_entityId: {
            schoolId: ctx.schoolId,
            profile: recipient.profile,
            entityId: recipient.entityId,
          },
        },
        data: {
          ...(input.primaryEmail !== undefined
            ? { primaryEmail: input.primaryEmail }
            : {}),
          ...(input.primaryPhone !== undefined
            ? { primaryPhone: input.primaryPhone }
            : {}),
        },
      });
    }),
} satisfies TRPCRouterRecord;
