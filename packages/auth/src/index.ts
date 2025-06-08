/* eslint-disable @typescript-eslint/no-unused-vars */
import type { BetterAuthOptions } from "better-auth";
import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { apiKey, oAuthProxy, username } from "better-auth/plugins";

import { db } from "@repo/db";
import { sendEmail } from "@repo/utils";

export function initAuth(options: {
  baseUrl: string;
  productionUrl: string;
  secret: string | undefined;
}) {
  const config = {
    database: prismaAdapter(db, {
      provider: "postgresql",
    }),
    user: {
      modelName: "user",
      additionalFields: {
        profile: {
          type: "string",
          required: true,
        },
        username: {
          type: "string",
          required: true,
        },
        schoolId: {
          type: "string",
          required: true,
        },
      },
    },
    session: {
      modelName: "session",
    },
    account: {
      modelName: "account",
    },
    verification: {
      modelName: "verification",
    },

    baseURL: options.baseUrl,
    secret: options.secret,
    emailAndPassword: {
      enabled: true,
      sendResetPassword: async ({ user, url, token }, request) => {
        const da = await sendEmail({
          from: "Discolaire <hi@discolaire.com>",
          to: "jpainam@gmail.com",
          subject: "Reset your password",
          text: `Click the link to reset your password: ${url}`,
        });
      },
      requireEmailVerification: false,
    },
    emailVerification: {
      sendOnSignUp: true,

      sendVerificationEmail: async ({ user, url, token }, _request) => {
        await sendEmail({
          from: "Discolaire <hi@discolaire.com>",
          to: user.email,
          subject: "Verify your email address",
          text: `Click the link to verify your email: ${url} or copy and paste this token: ${token}`,
          html: `<p>Click the link to verify your email: <a href="${url}">${url}</a></p><p>or copy and paste this token: <strong>${token}</strong></p>`,
        });
      },
    },
    plugins: [
      username(),
      apiKey({
        enableMetadata: true,
      }),
      oAuthProxy({
        /**
         * Auto-inference blocked by https://github.com/better-auth/better-auth/pull/2891
         */
        currentURL: options.baseUrl,
        productionURL: options.productionUrl,
      }),
      expo(),
      nextCookies(),
    ],
    trustedOrigins: ["expo://"],
  } satisfies BetterAuthOptions;

  return betterAuth(config);
}

export type Auth = ReturnType<typeof initAuth>;
export type Session = Auth["$Infer"]["Session"];
