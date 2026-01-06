import { nanoid } from "nanoid";
import { Resend } from "resend";

import { env } from "../env";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendEmail(opts: {
  toEmail: string;
  subject: string;
  bodyText: string;
}) {
  if (opts.toEmail.includes("@example.com")) {
    console.warn("Cannot send emails to @example.com addresses", opts.toEmail);
    return null;
  }
  const { data, error } = await resend.emails.send({
    from: "Discolaire <contact@discolaire.com>",
    to: opts.toEmail,

    subject: opts.subject,
    headers: {
      "X-Entity-Ref-ID": nanoid(),
    },
    html: opts.bodyText,
    // text: text,
    // react: react,
  });

  if (error) {
    console.error("Error sending email:", error);
    throw new Error(error.message);
  }
  return { provider: "EMAIL", providerMsgId: data.id };
}
