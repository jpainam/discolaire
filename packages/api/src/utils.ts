/* eslint-disable @typescript-eslint/no-explicit-any */
// export const generateToken = (user: { id: string }) => {
//   const payload = {
//     sub: user.id,
//     iat: new Date().getTime(),
//     exp: addDays(new Date(), 30).getTime(),
//   };
//   return jwt.sign(payload, env.AUTH_SECRET);
// };
import { decode } from "entities";

type Person = {
  firstName?: string | null;
  lastName?: string | null;
  middleName?: string | null;
} & Record<string, any>;

export function generateStringColor(): string {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Define queues

export function roundToTwo(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function getCookieValue(headers: Headers, name: string): string | null {
  const cookieHeader = headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").reduce(
    (acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      if (!key || !value) return acc; // Skip if key or value is missing
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>,
  );

  return cookies[name] ?? null;
}

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

export { buildPermissionIndex, checkPermission } from "@repo/utils";
