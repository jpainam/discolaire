import { nanoid } from "nanoid";
import { Resend } from "resend";

import { env } from "../env";

export interface SendResult {
  provider: string;
  providerMsgId: string;
}
export const resend = new Resend(env.RESEND_API_KEY);

export async function sendEmail(opts: {
  toEmail: string;
  subject: string;
  bodyText: string;
}): Promise<SendResult | null> {
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

export async function sendSms(opts: {
  toPhone: string;
  bodyText: string;
}): Promise<SendResult> {
  // Replace with Twilio/AWS SNS/etc
  await new Promise((resolve) => setTimeout(resolve, 1));
  console.log("[SMS] to:", opts.toPhone);
  return { provider: "SMS", providerMsgId: crypto.randomUUID() };
}

export async function sendWhatsapp(opts: {
  toPhone: string;
  bodyText: string;
}): Promise<SendResult> {
  await new Promise((resolve) => setTimeout(resolve, 1));
  // Replace with Meta WhatsApp Cloud API / Twilio WhatsApp
  console.log("[WHATSAPP] to:", opts.toPhone);
  return { provider: "WHATSAPP", providerMsgId: crypto.randomUUID() };
}
