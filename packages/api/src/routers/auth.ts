//import { comparePasswords, signToken } from "@repo/auth/session";

import type { TRPCRouterRecord } from "@trpc/server";

import { publicProcedure } from "../trpc";

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  // signin: publicProcedure
  //   .input(
  //     z.object({ username: z.string().min(1), password: z.string().min(1) }),
  //   )
  //   .query(async ({ ctx, input }) => {
  //     const user = await ctx.db.user.findFirst({
  //       where: {
  //         username: input.username,
  //       },
  //     });
  //     if (!user) {
  //       throw new TRPCError({
  //         code: "UNAUTHORIZED",
  //         message: "Invalid credentials",
  //       });
  //     }
  //     const isPasswordValid = await comparePasswords(
  //       input.password,
  //       user.password,
  //     );
  //     if (!isPasswordValid) {
  //       throw new TRPCError({
  //         code: "UNAUTHORIZED",
  //         message: "Invalid credentials",
  //       });
  //     }
  //     const schoolYear = await schoolYearService.getDefault(user.schoolId);

  //     if (!schoolYear) {
  //       throw new TRPCError({
  //         code: "BAD_REQUEST",
  //         message: "No school year found",
  //       });
  //     }
  //     const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
  //     const session = {
  //       user: { id: user.id },
  //       expires: expiresInOneDay.toISOString(),
  //     };
  //     const encryptedSession = await signToken(session);
  //     return {
  //       sessionToken: encryptedSession,
  //       schoolYearId: schoolYear.id,
  //     };
  //   }),
} satisfies TRPCRouterRecord;
