/* eslint-disable @typescript-eslint/no-explicit-any */
import { decode } from "entities";
import z from "zod";

type Person = {
  firstName?: string | null;
  lastName?: string | null;
  middleName?: string | null;
} & Record<string, any>;

export function getFullName(pperson?: any): string {
  if (!pperson) {
    return "";
  }
  const person = pperson as Person;
  let fullName = "";
  if ("lastName" in person && person.lastName) {
    fullName += " " + person.lastName;
  }
  if ("middleName" in person && person.middleName) {
    fullName += " " + person.middleName;
  }
  if ("firstName" in person && person.firstName) {
    fullName += " " + person.firstName;
  }
  return decode(fullName);
}

export function addSpacesToCamelCase(str: string) {
  return str.replace(/([a-z])([A-Z])/g, "$1 $2");
}

/**
 *
 * @param person
 * @param part  > 0 1..n (n = length of name parts)
 * @returns
 */
export function getNameParts(person?: any, ppart?: number) {
  const v = getFullName(person);
  const part = ppart ?? 0;
  const tabs = v.split(" ").filter((s) => s.length > 0);
  if (tabs.length > part) {
    return tabs[part - 1] ?? "";
  }
  return v;
}

export function getAge(date: string | Date | null | undefined) {
  if (!date) {
    return 0;
  }
  const dob = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export function isAnniversary(dateOfBirth: Date, windowDays = 3): boolean {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  for (let offset = -windowDays; offset <= windowDays; offset++) {
    const candidate = new Date(today);
    candidate.setDate(today.getDate() + offset);
    if (
      dateOfBirth.getMonth() === candidate.getMonth() &&
      dateOfBirth.getDate() === candidate.getDate()
    ) {
      return true;
    }
  }
  return false;
}

export const xlsxType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

// Source - https://stackoverflow.com/a/79475906
// Posted by vzsoares
// Retrieved 2026-01-25, License - CC BY-SA 4.0

export const fixHtmlFormOptionalFields = <T extends z.ZodObject<any, any>>(
  schema: T,
): T => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const entries = Object.entries(schema.shape);

  const transformedEntries = entries.map(([key, value]) => {
    // Only transform optional schemas
    if (value instanceof z.ZodOptional) {
      return [key, z.union([value, z.literal("")])];
    }

    return [key, value];
  });

  return z.object(Object.fromEntries(transformedEntries)) as T;
};

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};
