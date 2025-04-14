"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  comparePasswords,
  setSchoolYearSession,
  setSession,
} from "@repo/auth/session";
import { db } from "@repo/db";

import { caller } from "~/trpc/server";

const signInSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function signIn(
  previousState: { error: string },
  formData: FormData
) {
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      error: "Invalid form data",
    };
  }
  const { username, password } = parsed.data;

  const user = await db.user.findFirst({
    where: {
      username: username,
    },
  });
  if (!user) {
    return {
      error: "invalid_credentials",
    };
  }
  const isPasswordValid = await comparePasswords(password, user.password);

  if (!isPasswordValid) {
    return {
      error: "invalid_credentials",
    };
  }

  const schoolYear = await caller.schoolYear.getDefault({
    schoolId: user.schoolId,
  });

  if (!schoolYear) {
    return {
      error: "no_school_year",
    };
  }
  await Promise.all([setSession(user), setSchoolYearSession(schoolYear.id)]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const redirectTo = formData.get("redirect") as string | null;
  //redirect(redirectTo ?? "/");
  await caller.user.logLoginActivity();
  redirect("/");
}

export async function signOut() {
  //const user = await auth();
  // if (!user) {
  //   return;
  // }
  (await cookies()).delete("session");
}

export async function setSchoolYearCookie(schoolYearId: string) {
  const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
  (await cookies()).set("schoolYear", schoolYearId, {
    expires: expiresInOneDay,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
}
