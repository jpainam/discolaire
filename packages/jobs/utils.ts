import { addDays } from "date-fns";
import jwt from "jsonwebtoken";

import { env } from "./env";

export const generateToken = (user: { id: string }) => {
  const payload = {
    sub: user.id,
    iat: new Date().getTime(),
    exp: addDays(new Date(), 30).getTime(),
  };
  return jwt.sign(payload, env.AUTH_SECRET);
};
