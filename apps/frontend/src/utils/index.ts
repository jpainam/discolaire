/* eslint-disable @typescript-eslint/no-explicit-any */
import { decode } from "entities";

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
    return "";
  }
  const dob = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - dob.getTime();
  const age = new Date(diff);
  return Math.abs(age.getUTCFullYear() - 1970);
}

export function isAnniversary(dateOfBirth: Date): boolean {
  const currentDate = new Date();
  return (
    dateOfBirth.getMonth() === currentDate.getMonth() &&
    dateOfBirth.getDate() === currentDate.getDate()
  );
}

export const xlsxType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
