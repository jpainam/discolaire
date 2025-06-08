// export const generateToken = (user: { id: string }) => {
//   const payload = {
//     sub: user.id,
//     iat: new Date().getTime(),
//     exp: addDays(new Date(), 30).getTime(),
//   };
//   return jwt.sign(payload, env.AUTH_SECRET);
// };

import { compare, hash } from "bcryptjs";
import { Queue } from "bullmq";
import IORedis from "ioredis";

import { env } from "./env";

export function generateStringColor(): string {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * Exclude keys from object
 * @param obj
 * @param keys
 * @returns
 */
export const exclude = <Type, Key extends keyof Type>(
  obj: Type,
  keys: Key[],
): Omit<Type, Key> => {
  for (const key of keys) {
    delete obj[key];
  }
  return obj;
};

const connection = new IORedis(`${env.REDIS_URL}?family=0`, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// Define queues
export const logQueue = new Queue("log", { connection });
export const notificationQueue = new Queue("notification", { connection });

export function roundToTwo(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

//const key = new TextEncoder().encode(env.AUTH_SECRET);
const SALT_ROUNDS = 10;

export async function hashPassword(password: string) {
  return hash(password, SALT_ROUNDS);
}

export async function comparePasswords(
  plainTextPassword: string,
  hashedPassword: string,
) {
  return compare(plainTextPassword, hashedPassword);
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
