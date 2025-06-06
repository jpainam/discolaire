import type { BetterAuthOptions } from "better-auth";
import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { apiKey, oAuthProxy, username } from "better-auth/plugins";

import { sendEmail } from "@repo/api/email";
import { db } from "@repo/db";

export function initAuth(options: {
  baseUrl: string;
  productionUrl: string;
  secret: string | undefined;

  //discordClientId: string;
  //discordClientSecret: string;
}) {
  const config = {
    database: prismaAdapter(db, {
      provider: "postgresql",
    }),
    user: {
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
    baseURL: options.baseUrl,
    secret: options.secret,
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
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
      apiKey(),
      oAuthProxy({
        /**
         * Auto-inference blocked by https://github.com/better-auth/better-auth/pull/2891
         */
        currentURL: options.baseUrl,
        productionURL: options.productionUrl,
      }),
      expo(),
    ],
    // socialProviders: {
    //   discord: {
    //     clientId: options.discordClientId,
    //     clientSecret: options.discordClientSecret,
    //     redirectURI: `${options.productionUrl}/api/auth/callback/discord`,
    //   },
    // },
    trustedOrigins: ["expo://"],
  } satisfies BetterAuthOptions;

  return betterAuth(config);
}

export type Auth = ReturnType<typeof initAuth>;
export type Session = Auth["$Infer"]["Session"];

// export const auth = betterAuth({
//   database: prismaAdapter(prisma, {
//     provider: "postgresql",
//   }),
//   plugins: [username(), apiKey()],
// });
