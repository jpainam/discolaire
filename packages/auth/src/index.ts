/* eslint-disable @typescript-eslint/no-unused-vars */
import type { BetterAuthOptions } from "better-auth";
import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { admin, apiKey, oAuthProxy, username } from "better-auth/plugins";

import { db } from "@repo/db";
import { sendEmail } from "@repo/utils";

import { authEnv } from "../env";
import { completeRegistration, sendResetPassword } from "./utils";

const env = authEnv();
/* eslint-disable @typescript-eslint/require-await */
export function initAuth(options: {
  secret: string | undefined;
  baseUrl: string;
}) {
  const config = {
    database: prismaAdapter(db, {
      provider: "postgresql",
    }),
    baseURL: options.baseUrl,
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
          console.log(">>> sendChangeEmailVerification:", user.email, newEmail);
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
    secret: options.secret,
    emailAndPassword: {
      enabled: true,
      sendResetPassword: async ({ user, url, token }, request) => {
        console.log(">>> sendResetPassword:", user.email);
        if (user.email.includes("@discolaire.com")) {
          return;
        }
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
        console.log(">>> sendVerificationEmail", user.email);
        if (user.emailVerified) {
          console.warn("User already verified, skipping email verification");
          return;
        }
        await sendEmail({
          from: "Discolaire <hi@discolaire.com>",
          to: user.email,
          subject: "Verifier votre adresse e-mail",
          text: `Cliquez sur le lien ci-dessous pour vérifier votre adresse e-mail : ${url}`,
          html: `<p>Cliquez sur le lien ci-dessous pour vérifier votre adresse e-mail <a href='${url}'>${url}</a></p>`,
        });
      },
    },
    // advanced: {
    //   crossSubDomainCookies: {
    //     enabled: env.NODE_ENV === "production",
    //     domain: `discolaire.com`, // your domain
    //   },
    // },
    plugins: [
      admin(),
      username(),
      apiKey({
        enableMetadata: true,
        // apiKeyHeaders: ["x-api-key", "xyz-api-key"]
      }),
      oAuthProxy(),
      expo(),
      nextCookies(),
    ],
    trustedOrigins: [
      "expo://",
      env.NEXT_PUBLIC_BASE_URL,
      "http://localhost:3000",
    ],
  } satisfies BetterAuthOptions;

  return betterAuth(config);
}

export type Auth = ReturnType<typeof initAuth>;
export type Session = Auth["$Infer"]["Session"];
// export const auth = initAuth({
//   baseUrl: "http://localhost:3000",
//   productionUrl: "https://discolaire.com",
//   secret: "test_scret",
// });
