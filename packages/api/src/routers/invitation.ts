import { z } from "zod";

import { getInvitationCode } from "@repo/lib";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const invitationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ email: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const code = await getInvitationCode(input.email);
      const data = {
        token: code,
        name: input.name,
        email: input.email,
        lastSendById: ctx.session.user.id,
      };
      const lastInvitation = await ctx.db.invitation.findFirst({
        where: { email: input.email },
        orderBy: { createdAt: "desc" },
      });
      if (lastInvitation) {
        return ctx.db.invitation.update({
          where: { id: lastInvitation.id },
          data: { ...data, lastSentAt: new Date() },
        });
      }
      return ctx.db.invitation.create({
        data: data,
      });
    }),
});
