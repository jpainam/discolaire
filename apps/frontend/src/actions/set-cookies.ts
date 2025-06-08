"use server";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSession } from "~/auth/server";
import { caller } from "~/trpc/server";

export async function setSchoolYearCookie(schoolYearId: string) {
  const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
  (await cookies()).set("x-school-year", schoolYearId, {
    expires: expiresInOneDay,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
}

export async function signInSchoolYearCookie() {
  const session = await getSession();
  if (!session) {
    return Error("No session found. User must be authenticated.");
  }
  const schoolYear = await caller.schoolYear.getDefault({
    schoolId: session.user.schoolId,
  });
  if (!schoolYear) {
    return Error("No default school year found for the user.");
  }

  const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);

  (await cookies()).set("x-school-year", schoolYear.id, {
    expires: expiresInOneDay,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });

  return NextResponse.json({ ok: true });
}
