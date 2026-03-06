/* eslint-disable @typescript-eslint/no-unused-vars */
import type { BetterAuthOptions } from "better-auth";
import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import {
  admin,
  apiKey,
  oAuthProxy,
  organization,
  username,
} from "better-auth/plugins";

import { getDb } from "@repo/db";

import { authEnv } from "../env";
import {
  completeRegistration,
  sendChangeEmailVerification,
  sendOrganizationInvitation,
  sendResetPassword,
  sendVerificationEmail,
} from "./utils";

const env = authEnv();

export function initAuth(options: {
  secret: string | undefined;
  baseUrl: string;
  tenant: string;
}) {
  const config = {
    database: prismaAdapter(
      getDb({ connectionString: env.DATABASE_URL, tenant: options.tenant }),
      {
        provider: "postgresql",
      },
    ),
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
        beforeDelete: async (user, _request) => {
          await new Promise((resolve) => setTimeout(resolve, 1));
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
          { user, newEmail, url },
          _request,
        ) => {
          console.log(">>> sendChangeEmailVerification:", user.email, newEmail);
          await sendChangeEmailVerification({
            user,
            newEmail,
            url,
            baseUrl: options.baseUrl,
            tenant: options.tenant,
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
        if (user.email.includes("@discolaire.com")) {
          console.warn(`Cannot send email to a @discolaire: ${user.email}`);
          return;
        }
        if (url.includes("complete-registration")) {
          console.log("Completing registration");
          await completeRegistration({
            user,
            url,
            baseUrl: options.baseUrl,
            tenant: options.tenant,
          });
        } else {
          await sendResetPassword({
            user,
            url,
            baseUrl: options.baseUrl,
            tenant: options.tenant,
          });
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
        await sendVerificationEmail({
          user,
          url,
          baseUrl: options.baseUrl,
          tenant: options.tenant,
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
      organization({
        async sendInvitationEmail(data) {
          const inviteLink = `${options.baseUrl}/auth/accept-invitation/${data.id}`;
          await sendOrganizationInvitation({
            email: data.email,
            invitedByUsername: data.inviter.user.name,
            invitedByEmail: data.inviter.user.email,
            teamName: data.organization.name,
            inviteLink,
          });
        },
      }),
      oAuthProxy(),
      expo(),
      nextCookies(),
    ],
    trustedOrigins: [
      "expo://",
      "exp://",
      "exps://",
      "discolaire://",
      "exp+discolaire://",
      options.baseUrl,
      // eslint-disable-next-line no-restricted-properties
      process.env.NEXT_PUBLIC_BASE_URL ?? "",
      "http://localhost:3000",
      "http://localhost:8081",
      "http://127.0.0.1:8081",
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
