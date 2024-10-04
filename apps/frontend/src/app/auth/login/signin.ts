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
  let res = null;
  try {
    const parsed = signInSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return {
        error: "Invalid form data",
      };
    }
    const { username, password } = parsed.data;
    res = await signIn("credentials", {
      username: username,
      password: password,
    });

    redirect("/");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (res == null) {
      redirect("/");
    }
    return {
      error: "invalid_credentials",
    };
  }
}
