"server-only";

import { cookies } from "next/headers";

import type { User } from "@repo/db";

import { getUser, verifyToken } from "./session";

export interface Session {
  user: User;
  expires: string;
}

//export type { Session } from "next-auth";

export async function auth() {
  console.log(">>>>>>>>>running auth");
  const sessionCookie = cookies().get("session");
  if (!sessionCookie?.value) {
    return null;
  }
  console.log(">>>>>>>>>sessionCookie", sessionCookie);
  const sessionData = await verifyToken(sessionCookie.value);
  console.log(">>>>>>>>>sessionData", sessionData);
  if (!sessionData.user.id) {
    return null;
  }
  console.log(">>>>>>>>>sessionData.user.id", sessionData.user.id);

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }
  console.log(">>>>>>>>>sessionData.expires", sessionData.expires);
  const user = await getUser(sessionData.user.id);

  console.log(">>>>>>>>>userRunning a function ", user);
  if (!user) {
    return null;
  }
  return { user: user, expires: sessionData.expires } as Session;
}
