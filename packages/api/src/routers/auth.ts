import { z } from "zod";

import { comparePasswords, signToken } from "@repo/auth/session";

import { schoolYearService } from "../services/school-year-service";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  signin: publicProcedure
    .input(
      z.object({ username: z.string().min(1), password: z.string().min(1) }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          username: input.username,
        },
      });
      if (!user) {
        return {
          error: "Invalid credentials",
        };
      }
      const isPasswordValid = await comparePasswords(
        input.password,
        user.password,
      );
      if (!isPasswordValid) {
        return {
          error: "Invalid credentials",
        };
      }
      const schoolYear = await schoolYearService.getDefault(user.schoolId);

      if (!schoolYear) {
        return {
          error: "No school year found",
        };
      }
      const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const session = {
        user: { id: user.id },
        expires: expiresInOneDay.toISOString(),
      };
      const encryptedSession = await signToken(session);
      return {
        sessionToken: encryptedSession,
        schoolYearId: schoolYear.id,
      };
    }),
});
