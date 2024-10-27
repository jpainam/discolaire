"use server";

import { cookies } from "next/headers";

export async function getSchoolYearFromCookie() {
  const schoolYear = (await cookies()).get("schoolYear");
  const schoolYearValue = schoolYear ? schoolYear.value : undefined;
  return schoolYearValue;
}

export async function createSchoolYearCookie(input: string) {
  (await cookies()).set({
    name: "schoolYear",
    value: input,
    // Set httpOnly to false when creating the cookie. So the cookie is visible in the client
    httpOnly: false,
    path: "/",
  });
}
