"use server";

import { redirect } from "next/navigation";

import { comparePasswords, hashPassword, setSession } from "@repo/auth/session";
import { db } from "@repo/db";

export async function signIn({
  username,
  password,
  redirectTo,
}: {
  username: string;
  password: string;
  redirectTo?: string;
}) {
  const hashed = await hashPassword(password);
  console.log("hashed password", hashed);
  const foundUser = await db.user.findFirst({
    where: {
      username: username,
    },
  });
  console.log("found user", foundUser);
  if (!foundUser) {
    throw new Error("Invalid email or password.");
  }
  const isPasswordValid = await comparePasswords(password, foundUser.password);
  console.log("isPasswordValid", isPasswordValid);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password.");
  }

  await setSession(foundUser);
  console.log("Session set");
  console.log("redirecting to", redirectTo);

  if (redirectTo) {
    redirect(redirectTo);
  }
  redirect("/");
}
