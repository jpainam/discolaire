import type {
  DefaultSession,
  NextAuthConfig,
  Session as NextAuthSession,
} from "next-auth";
import type { Adapter } from "next-auth/adapters";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { addDays } from "date-fns";
import jwt from "jsonwebtoken";
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
      username: string;
      schoolId: string;
      profile: string;
    } & DefaultSession["user"];
  }
}
const adapter: Adapter = PrismaAdapter(db);
export const isSecureContext = env.NODE_ENV !== "development";
export const authConfig = {
  adapter,
  // // In development, we need to skip checks to allow Expo to work
  // ...(!isSecureContext
  //   ? {
  //       skipCSRFCheck: skipCSRFCheck,
  //       trustHost: true,
  //     }
  //   : {}),
  secret: env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    verifyRequest: "/auth/verify-request",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        const parsed = z
          .object({ username: z.string().min(1), password: z.string().min(1) })
          .safeParse(credentials);
        if (parsed.success) {
          const { username, password } = parsed.data;
          const user = await db.user.findFirst({
            where: {
              username: username,
            },
          });

          if (!user || !(await isPasswordMatch(password, user.password))) {
            return null;
          }
          const returnedUser = exclude(user, ["password"]);
          return returnedUser;
        }
        return null;
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
): Promise<NextAuthSession | null> => {
  const sessionToken = token.slice("Bearer ".length);
  //const session = await adapter.getSessionAndUser?.(sessionToken);
  try {
    const payload = jwt.verify(sessionToken, env.AUTH_SECRET ?? "") as {
      sub?: string | undefined;
    };
    const userId = payload.sub;
    const user = await db.user.findUnique({
      where: {
        id: userId,
        isActive: true,
      },
    });
    return user
      ? {
          user: {
            email: user.email,
            id: user.id,
            name: user.name,
            username: user.username,
            schoolId: user.schoolId,
            profile: user.profile,
            avatar: user.avatar ?? "",
          },
          expires: addDays(new Date(), 30).toISOString(),
        }
      : null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return null;
  }
};

export const invalidateSessionToken = async (token: string) => {
  const sessionToken = token.slice("Bearer ".length);
  await adapter.deleteSession?.(sessionToken);
};

export const generateToken = (user: { id: string }) => {
  const payload = {
    sub: user.id,
    iat: new Date().getTime(),
    exp: addDays(new Date(), 30).getTime(),
  };
  return jwt.sign(payload, env.AUTH_SECRET ?? "");
};
