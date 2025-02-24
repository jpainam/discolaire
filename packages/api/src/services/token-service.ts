import crypto from "crypto";
import { TRPCError } from "@trpc/server";

import type { Token } from "@repo/db";
import { db, TokenType } from "@repo/db";

export const tokenService = {
  verifyToken: async (
    userId: string,
    token: string,
    type: TokenType,
  ): Promise<Token | null> => {
    return db.token.findFirst({
      where: { token, type, userId, blacklisted: false },
    });
  },
  generateResetPasswordToken: async (email: string): Promise<string> => {
    const user = await db.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No users found with this email",
      });
    }
    const token = crypto.randomBytes(32).toString("hex");
    const expiryTime = Date.now() + 24 * 60 * 60 * 1000;

    await db.token.create({
      data: {
        token,
        userId: user.id,
        expires: new Date(expiryTime),
        type: TokenType.RESET_PASSWORD,
        blacklisted: false,
      },
    });
    return token;
  },
};
