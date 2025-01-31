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

import { api } from "~/trpc/server";

const signInSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function signIn(
  previousState: { error: string },
  formData: FormData,
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

  const schoolYear = await api.schoolYear.getDefault({
    schoolId: user.schoolId,
  });

  if (!schoolYear) {
    return {
      error: "no_school_year",
    };
  }
  await Promise.all([setSession(user), setSchoolYearSession(schoolYear.id)]);
  const redirectTo = formData.get("redirect") as string | null;
  redirect(redirectTo ?? "/");
}

export async function signOut() {
  //const user = await auth();
  // if (!user) {
  //   return;
  // }
  (await cookies()).delete("session");
}
