import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { generateToken, invalidateSessionToken } from "@repo/auth";

import { isPasswordMatch } from "../encrypt";
import { protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),
  signInWithPassword: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          email: input.email,
        },
      });
      if (!user || !(await isPasswordMatch(input.password, user.password))) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Incorrect email or password",
        });
      }
      console.log("user", user);
      const token = generateToken({ id: user.id });
      console.log("token", token);
      return token;
    }),
  signOut: protectedProcedure.mutation(async (opts) => {
    if (!opts.ctx.token) {
      return { success: false };
    }
    await invalidateSessionToken(opts.ctx.token);
    return { success: true };
  }),
} satisfies TRPCRouterRecord;
