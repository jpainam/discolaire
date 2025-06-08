/* eslint-disable @typescript-eslint/no-unused-vars */
import type { BetterAuthOptions } from "better-auth";
import { expo } from "@better-auth/expo";
import { APIError, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { apiKey, oAuthProxy, username } from "better-auth/plugins";

import { db } from "@repo/db";
import { sendEmail } from "@repo/utils";

/* eslint-disable @typescript-eslint/require-await */
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
      deleteUser: {
        enabled: true,
        beforeDelete: async (user, request) => {
          if (user.email.includes("admin")) {
            throw new APIError("BAD_REQUEST", {
              message: "Admin accounts can't be deleted",
            });
          }
        },
      },
      changeEmail: {
        enabled: true,
        sendChangeEmailVerification: async (
          { user, newEmail, url, token },
          request,
        ) => {
          await sendEmail({
            from: "Discolaire <hi@discolaire.com>",
            to: user.email, // verification email must be sent to the current user email to approve the change
            subject: "Approve email change",
            text: `Click the link to approve the change: ${url}`,
          });
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
          to: user.email,
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
