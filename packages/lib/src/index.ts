import crypto from "crypto";
import bcrypt from "bcryptjs";
import { cx } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: Parameters<typeof cx>) => twMerge(cx(inputs));

export { cn };

export const getInvitationCode = async (email: string): Promise<string> => {
  const INVITATION_LINK_SECRET = crypto.randomUUID();
  const encryptedCode = await bcrypt.hash(email + INVITATION_LINK_SECRET, 8);
  console.log("Encrypted code: ", encryptedCode);
  const code = crypto.randomUUID();
  return code.slice(0, 4);
};

export { numberToWords } from "./toword";
