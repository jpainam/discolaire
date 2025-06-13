/* eslint-disable @typescript-eslint/no-unused-vars */
import type { BetterAuthOptions, BetterAuthPlugin } from "better-auth";
import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { admin, apiKey, oAuthProxy, username } from "better-auth/plugins";

import { db } from "@repo/db";
import { sendEmail } from "@repo/utils";

import { completeRegistration, sendResetPassword } from "./emails";

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
      // Prisma automically camelCases model names, so we use camelCase here
      modelName: "user",
      additionalFields: {
        isActive: {
          type: "boolean",
          required: true,
        },
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
            subject: "Confirmation de changement d'email",
            text: `Cliquez sur le lien pour confirmer le changement.: ${url}`,
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
      //disableSignUp: true,
      sendResetPassword: async ({ user, url, token }, request) => {
        if (url.includes("complete-registration")) {
          await completeRegistration({ user, url });
        } else {
          await sendResetPassword({ user, url });
        }
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
          text: `Cliquez sur le lien pour vérifier votre adresse e-mail : ${url}`,
          html: `<p>Click the link to verify your email: <a href="${url}">${url}</a></p>`,
        });
      },
    },
    plugins: [
      admin() as unknown as BetterAuthPlugin,
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
export const auth = initAuth({
  baseUrl: "http://localhost:3000",
  productionUrl: "https://discolaire.com",
  secret: "test_scret",
});
