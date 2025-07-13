"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "~/auth/server";
import { env } from "~/env";
import { caller } from "~/trpc/server";

export async function signIn(
  prevState: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string } | undefined> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const redirectTo = formData.get("redirectTo") as string | null;
  let user;
  let schoolYear;

  try {
    const result = await auth.api.signInUsername({
      body: {
        username: username.toLowerCase(),
        password,
        rememberMe: true,
      },
      headers: await headers(),
    });

    if (!result) {
      return { error: "invalid_credentials" };
    }

    user = result.user;

    schoolYear = await caller.schoolYear.getDefault({
      userId: user.id,
    });

    if (!schoolYear) {
      return { error: "no_school_year" };
    }

    await setSchoolYearCookie(schoolYear.id);
  } catch (error) {
    const err = error as Error;
    return { error: err.message || "unknown_error" };
  }

  // ✅ Redirect outside the try-catch
  if (redirectTo && redirectTo.trim() !== "") {
    redirect(redirectTo);
  }

  redirect("/");
}

export async function setCookieFromSignIn({ userId }: { userId: string }) {
  const schoolYear = await caller.schoolYear.getDefault({
    userId: userId,
  });

  if (!schoolYear) {
    return {
      error: "no_school_year",
    };
  }
  await setSchoolYearCookie(schoolYear.id);
  return {
    error: null,
  };
}

export async function setSchoolYearCookie(schoolYearId: string) {
  const isSecure =
    env.NODE_ENV === "production" &&
    env.NEXT_PUBLIC_BASE_URL.startsWith("https");
  const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
  (await cookies()).set("x-school-year", schoolYearId, {
    expires: expiresInOneDay,
    httpOnly: true,
    secure: isSecure, // 👈 allow over HTTP, Hosted locally
    sameSite: "lax",
  });
}
