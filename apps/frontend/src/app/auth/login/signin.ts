"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { signIn } from "@repo/auth";
import { db } from "@repo/db";

import { api } from "~/trpc/server";

const signInSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function authenticate(
  previousState: { error: string },
  formData: FormData,
) {
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  let isError = false;
  if (!parsed.success) {
    return {
      error: "Invalid form data",
    };
  }
  const { username, password } = parsed.data;
  try {
    const res = await signIn("credentials", {
      username: username,
      password: password,
      redirect: false,
    });

    if (!res || res?.error) {
      return {
        error: "invalid_credentials",
      };
    }
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
    const schoolYear = await api.schoolYear.getDefault();
    if (!schoolYear) {
      return {
        error: "no_school_year",
      };
    }
    cookies().set({
      name: "schoolYear",
      value: schoolYear.id,
      // Set httpOnly to false when creating the cookie. So the cookie is visible in the client
      httpOnly: false,
      path: "/",
    });
    return {
      error: "",
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    isError = true;
    // import { isRedirectError } from 'next/dist/client/components/redirect'
    return {
      error: "invalid_credentials",
    };
  } finally {
    if (!isError) {
      redirect("/");
    }
  }
}
