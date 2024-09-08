import type {
  DefaultSession,
  NextAuthConfig,
  Session as NextAuthSession,
} from "next-auth";
import type { Adapter, AdapterSession, AdapterUser } from "next-auth/adapters";
import { skipCSRFCheck } from "@auth/core";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { addDays, subDays } from "date-fns";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { z } from "zod";

import { db } from "@repo/db";

import { env } from "../env";
import exclude from "./exclude";
import { isPasswordMatch } from "./utils";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      avatar: string;
    } & DefaultSession["user"];
  }
}
const adapter: Adapter = PrismaAdapter(db);
export const isSecureContext = env.NODE_ENV !== "development";
export const authConfig = {
  adapter,
  // In development, we need to skip checks to allow Expo to work
  ...(!isSecureContext
    ? {
        skipCSRFCheck: skipCSRFCheck,
        trustHost: true,
      }
    : {}),
  secret: env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        const parsed = z
          .object({ username: z.string().email(), password: z.string().min(1) })
          .safeParse(credentials);

        if (parsed.success) {
          const { username, password } = parsed.data;
          const user = await db.user.findFirst({
            where: {
              email: username,
            },
          });

          if (!user || !(await isPasswordMatch(password, user.password))) {
            throw new Error("Incorrect email or password");
          }
          const returnedUser = exclude(user, ["password"]);
          return returnedUser;
        }
        throw new Error("Invalid credentials");
      },
    }),
    GoogleProvider({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    jwt({ token, user }) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (user) {
        return { ...token, ...user };
      }
      return token;
    },
    session: ({ session, token }) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (token) {
        // @ts-expect-error TODO  fix this
        session.user = {
          ...session.user,
          ...token,
        };
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const validateToken = async (
  token: string,
  //): Promise<NextAuthSession | null> => {
): Promise<NextAuthSession> => {
  const sessionToken = token.slice("Bearer ".length);
  // TODO - This session is null for expo for now. Fix it.
  //const session = await adapter.getSessionAndUser?.(sessionToken);
  await Promise.resolve(setTimeout(() => null, 1000));
  // Solution, hard code session for now.
  const session = {
    user: {
      name: "Jean P. Ainam",
      email: "jpainam@gmail.com",
      id: "9d060304-e6e2-42e8-850b-639049222b77",
      avatar: null,
      isActive: true,
      emailVerified: subDays(new Date(), 30),
    },
    session: {
      expires: addDays(new Date(), 30),
      sessionToken: sessionToken,
      userId: "9d060304-e6e2-42e8-850b-639049222b77",
    },
  } as { user: AdapterUser; session: AdapterSession };

  // return session
  //   ? {
  //       user: {
  //         ...session.user,
  //         avatar: "",
  //       },
  //       expires: session.session.expires.toISOString(),
  //     }
  //   : null;
  return {
    user: {
      ...session.user,
      avatar: "",
    },
    expires: session.session.expires.toISOString(),
  };
};

export const invalidateSessionToken = async (token: string) => {
  const sessionToken = token.slice("Bearer ".length);
  await adapter.deleteSession?.(sessionToken);
};
