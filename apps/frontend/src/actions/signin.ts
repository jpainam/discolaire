"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";

import { getAuth, getSession } from "~/auth/server";
import { caller } from "~/trpc/server";
import { logger } from "~/utils/logger";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  redirectTo: z.string().optional(),
});
export async function signIn(
  prevState: { error?: string; _nonce?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string; _nonce?: string }> {
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    redirectTo: formData.get("redirectTo"),
  });
  if (!parsed.success) {
    return {
      error: "Invalid input",
      _nonce: crypto.randomUUID(),
    };
  }
  const { username, password, redirectTo } = parsed.data;
  await Promise.resolve();

  try {
    const requestHeaders = await headers();
    const auth = await getAuth(requestHeaders);
    const result = await auth.api.signInUsername({
      body: {
        username: username.toLowerCase(),
        password,
        rememberMe: true,
      },
      headers: requestHeaders,
    });

    if (!result) {
      return { error: "invalid_credentials", _nonce: crypto.randomUUID() };
    }

    const schoolYear = await caller.schoolYear.getDefault({
      userId: result.user.id,
    });

    if (!schoolYear) {
      return { error: "no_school_year" };
    }

    await setSchoolYearCookie(schoolYear.id);
  } catch (error) {
    const err = error as Error;
    logger.error(error);
    return {
      error: err.message,
      _nonce: crypto.randomUUID(),
    };
  }

  redirect(redirectTo && redirectTo.trim() !== "" ? redirectTo : "/");
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
  // const isSecure =
  //   env.NODE_ENV === "production" &&
  //   env.NEXT_PUBLIC_BASE_URL.startsWith("https");
  const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
  (await cookies()).set("x-school-year", schoolYearId, {
    expires: expiresInOneDay,
    httpOnly: true,
    secure: false, //isSecure, // 👈 allow over HTTP, Hosted locally
    sameSite: "lax",
  });
}

export async function createAuthApiKey() {
  const session = await getSession();
  if (!session) {
    throw new Error("Not authenticated");
  }
  const auth = await getAuth();
  const userId = session.user.id;
  const result = await auth.api.createApiKey({
    body: {
      name: "Auth API Key",
      rateLimitEnabled: false,
      //expiresIn: 60 * 60 * 24 * 7, // Omit for never expiring key
      prefix: "disc",
      userId: userId,
    },
  });
  return result;
}
