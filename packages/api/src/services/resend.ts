import type { Attachment } from "resend";
import { nanoid } from "nanoid";
import { Resend } from "resend";

import { env } from "../env";

export const resend = new Resend(env.RESEND_API_KEY);

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
