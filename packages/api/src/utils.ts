import { addDays } from "date-fns";
import jwt from "jsonwebtoken";

import { env } from "../env";

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

export const generateToken = (user: { id: string }) => {
  const payload = {
    sub: user.id,
    iat: new Date().getTime(),
    exp: addDays(new Date(), 30).getTime(),
  };
  return jwt.sign(payload, env.AUTH_SECRET);
};
