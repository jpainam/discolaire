"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { signIn } from "@repo/auth";

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
