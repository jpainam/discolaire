import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

//import { invalidateSessionToken } from "@repo/auth";

import { comparePasswords } from "@repo/auth/session";

import { ratelimiter } from "../rateLimit";
import { protectedProcedure, publicProcedure } from "../trpc";

//import { generateToken } from "../utils";

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),
  signInWithPassword: publicProcedure
    .use(ratelimiter({ limit: 20, namespace: "signIn.password" }))
    .input(
      z.object({
        username: z.string().min(1),
        password: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          username: input.username,
        },
      });
      if (!user || !(await comparePasswords(input.password, user.password))) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Incorrect username or password",
        });
      }
      //const token = generateToken({ id: user.id });
      // TODO  generate a token conforms to @repo/auth
      const token = crypto.randomUUID();
      return token;
    }),
  signOut: protectedProcedure.mutation((opts) => {
    if (!opts.ctx.token) {
      return { success: false };
    }
    //await invalidateSessionToken(opts.ctx.token);
    return { success: true };
  }),
} satisfies TRPCRouterRecord;
