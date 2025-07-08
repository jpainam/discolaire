// export const generateToken = (user: { id: string }) => {
//   const payload = {
//     sub: user.id,
//     iat: new Date().getTime(),
//     exp: addDays(new Date(), 30).getTime(),
//   };
//   return jwt.sign(payload, env.AUTH_SECRET);
// };

import { Queue } from "bullmq";

import connection from "@repo/kv";

export function generateStringColor(): string {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Define queues

export const notificationQueue = new Queue("notification", { connection });

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
