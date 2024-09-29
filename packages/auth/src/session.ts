"use server";

import { cookies } from "next/headers";
import { compare, hash } from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";

import type { User } from "@repo/db";
import { db } from "@repo/db";

import { env } from "../env";

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
  user: { id: string; avatar: string; username: string; schoolId: string };
  expires: string;
}

export async function signToken(payload: SessionData) {
  // @ts-expect-error TODO  fix this
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1 day from now")
    .sign(key);
}

export async function verifyToken(input: string) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload as unknown as SessionData;
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await verifyToken(session);
}

export async function getUser(userId: string) {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });
  return user;
}

export async function setSession(user: User) {
  const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session: SessionData = {
    user: {
      id: user.id,
      avatar: user.avatar ?? "",
      username: user.username,
      schoolId: user.schoolId,
    },
    expires: expiresInOneDay.toISOString(),
  };
  const encryptedSession = await signToken(session);
  cookies().set("session", encryptedSession, {
    expires: expiresInOneDay,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
}
