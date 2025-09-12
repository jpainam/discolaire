import type { Attachment } from "resend";
import { nanoid } from "nanoid";
import { Resend } from "resend";

import { authEnv } from "../env";

const env = authEnv();
export const resend = new Resend(env.RESEND_API_KEY);
export async function completeRegistration({
  user,
  url,
}: {
  user: { id: string; email: string; name: string };
  url: string;
}) {
  if (user.email.includes("@example.com")) {
    console.warn("User email is a placeholder, skipping email sending.");
    return;
  }

  const response = await fetch(
    `${env.NEXT_PUBLIC_BASE_URL}/api/emails/invitation`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.DISCOLAIRE_API_KEY,
      },
      body: JSON.stringify({
        userId: user.id,
        email: user.email,
        name: user.name,
        url: url,
      }),
    },
  );
  if (!response.ok) {
    const error = (await response.json()) as Error;
    console.error(error);
    throw new Error(`Failed to send invitation email: ${error.message}`);
  }
}

export async function sendResetPassword({
  user,
  url,
}: {
  user: { id: string; email: string; name: string };
  url: string;
}) {
  if (user.email.includes("@example.com")) {
    console.warn("User email is a placeholder, skipping email sending.");
    return;
  }

  const response = await fetch(
    `${env.NEXT_PUBLIC_BASE_URL}/api/emails/reset-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.DISCOLAIRE_API_KEY,
      },
      body: JSON.stringify({
        userId: user.id,
        email: user.email,
        name: user.name,
        url: url,
      }),
    },
  );
  if (!response.ok) {
    const error = (await response.json()) as Error;
    console.error(error);
    throw new Error(`Failed to send invitation email: ${error.message}`);
  }
}

export async function sendEmail({
  from,
  to,
  subject,
  html,
  react,
  text,
  attachments,
  bcc,
  cc,
}: {
  from: string;
  to: string | string[];
  subject: string;
  react?: React.ReactElement;
  html?: string;
  text?: string;
  attachments?: Attachment[];
  bcc?: string | string[];
  cc?: string | string[];
}) {
  if (to.includes("@discolaire.com")) {
    console.warn("Cannot send emails to @discolaire.com addresses", to);
    return;
  }
  if (to.includes("@example.com")) {
    console.warn("Cannot send emails to @example.com addresses", to);
    return;
  }
  const { data, error } = await resend.emails.send({
    from: from,
    to: to,
    bcc: bcc,
    cc: cc,
    subject: subject,
    headers: {
      "X-Entity-Ref-ID": nanoid(),
    },
    html: html,
    text: text,
    react: react,
    attachments: attachments,
  });

  if (error) {
    console.error("Error sending email:", error);
    throw new Error(error.message);
  } else {
    return data;
  }
}
