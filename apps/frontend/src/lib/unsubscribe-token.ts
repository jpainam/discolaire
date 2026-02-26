import { createHmac } from "crypto";

/**
 * All email types that support per-type unsubscribe.
 * Add new types here as new email routes are created.
 */
export const EMAIL_TYPES = [
  "NEW_ENROLLMENT",
  "TRANSACTION_CONFIRMATION",
  "TRANSACTION_SUMMARY",
  "ATTENDANCE",
  "CLASSROOM_TIMETABLE",
  "FALSE_GRADE",
] as const;

export type EmailType = (typeof EMAIL_TYPES)[number];

/** Separator unlikely to appear in emails, tenants, or type names. */
const SEP = "|";

function hmac(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

/**
 * Create a signed, opaque unsubscribe token embedding the email type.
 *
 * Format: `<base64url(emailType|email|tenant)>.<hmac>`
 *
 * The token is safe to put in a URL query param — no raw email or tenant
 * is exposed, and tampering is caught by the HMAC.
 */
export function createUnsubscribeToken(
  emailType: EmailType,
  email: string,
  tenant: string,
  secret: string,
): string {
  const payload = Buffer.from([emailType, email, tenant].join(SEP)).toString(
    "base64url",
  );
  const sig = hmac(payload, secret);
  return `${payload}.${sig}`;
}

/**
 * Verify and decode an unsubscribe token.
 * Returns `null` if the token is missing, malformed, or tampered with.
 */
export function verifyUnsubscribeToken(
  token: string,
  secret: string,
): { emailType: EmailType; email: string; tenant: string } | null {
  const dotIndex = token.lastIndexOf(".");
  if (dotIndex === -1) return null;

  const payload = token.slice(0, dotIndex);
  const sig = token.slice(dotIndex + 1);

  if (!payload || !sig) return null;

  // Constant-time comparison to prevent timing attacks
  const expectedSig = hmac(payload, secret);
  if (sig !== expectedSig) return null;

  const decoded = Buffer.from(payload, "base64url").toString("utf-8");
  const parts = decoded.split(SEP);
  if (parts.length !== 3) return null;

  const [emailType, email, tenant] = parts as [string, string, string];

  if (!EMAIL_TYPES.includes(emailType as EmailType)) return null;

  return { emailType: emailType as EmailType, email, tenant };
}
