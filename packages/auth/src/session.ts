"server-only";

import type { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { compare, hash } from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";

import type { User } from "@repo/db";
import { db } from "@repo/db";

import { env } from "./env";

const key = new TextEncoder().encode(env.AUTH_SECRET);
const SALT_ROUNDS = 10;

export async function hashPassword(password: string) {
  return hash(password, SALT_ROUNDS);
}

export async function comparePasswords(
  plainTextPassword: string,
  hashedPassword: string,
) {
  return compare(plainTextPassword, hashedPassword);
}

interface SessionData {
  user: { id: string };
  expires: string;
}

export async function signToken(payload: SessionData) {
  return await new SignJWT(payload as JwtPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1 day from now")
    .sign(key);
}

export async function verifyToken(input: string) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });

  // @ts-expect-error : No need to fix. This is expected
  return payload as SessionData;
}

// For Mobile
export async function validateToken(input: string) {
  const sessionToken = input.split(" ")[1] ?? ""; // Bearer token
  const sessionData = await verifyToken(sessionToken);
  if (typeof sessionData.user.id !== "string") {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const user = await db.user.findFirst({
    where: {
      id: sessionData.user.id,
    },
  });
  return {
    user,
    expires: sessionData.expires,
  };
}
export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  return await verifyToken(session);
}

export async function setSession(user: User) {
  const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session: SessionData = {
    user: { id: user.id },
    expires: expiresInOneDay.toISOString(),
  };
  const encryptedSession = await signToken(session);
  (await cookies()).set("session", encryptedSession, {
    expires: expiresInOneDay,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
}

export async function setSchoolYearSession(schoolYearId: string) {
  const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
  (await cookies()).set("x-school-year", schoolYearId, {
    expires: expiresInOneDay,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
}

export async function auth() {
  const user = await getUser();
  const session = await getSession();
  if (!user || !session) return null;

  return {
    user,
    expires: session.expires,
  };
}
export async function getUser() {
  const sessionCookie = (await cookies()).get("session");
  if (!sessionCookie?.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (typeof sessionData.user.id !== "string") {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const user = await db.user.findFirst({
    where: {
      id: sessionData.user.id,
    },
  });
  return user;
}
