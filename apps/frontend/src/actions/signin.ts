"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "~/auth/server";
import { caller } from "~/trpc/server";

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
  const result = await auth.api.signInUsername({
    body: {
      username,
      password,
    },
  });
  if (!result) {
    return {
      error: "invalid_credentials",
    };
  }

  const schoolYear = await caller.schoolYear.getDefault({
    userId: result.user.id,
  });

  if (!schoolYear) {
    return {
      error: "no_school_year",
    };
  }
  await setSchoolYearCookie(schoolYear.id);

  const redirectTo = formData.get("redirect") as string | null;
  if (redirectTo && redirectTo.trim() !== "") {
    redirect(redirectTo);
  }

  redirect("/");
}

export async function setSchoolYearCookie(schoolYearId: string) {
  const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
  (await cookies()).set("x-school-year", schoolYearId, {
    expires: expiresInOneDay,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
}
