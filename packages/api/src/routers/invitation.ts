import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const getInvitationCode = (email: string) => {
  return email + " " + crypto.randomUUID();
};
export const invitationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const code = getInvitationCode(input.email);
      const user = await ctx.db.user.findFirst({
        where: { email: input.email },
      });
      const data = {
        token: code,
        name: user?.name ?? input.email,
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
