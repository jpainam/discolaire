/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { env } from "../../env";

const messagingBaseUrl = env.MESSAGING_SERVICE_URL;

const headersList = {
  Authorization: `Bearer ${env.MESSAGING_SECRET_KEY}`,
  "Content-Type": "application/json",
};

export async function sendEmail({
  subject,
  body,
  to,
  schedule,
  receipt,
  cc,
  bcc,
}: {
  subject: string;
  body: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  schedule?: string;
  receipt?: boolean;
}) {
  try {
    const bodyContent = JSON.stringify({
      html: body,
      subject: subject,
      from: "DisScolaire <no-reply@discolaire.com>",
      to: to,
    });

    const response = await fetch(`${messagingBaseUrl}/api/v1/emails`, {
      method: "POST",
      body: bodyContent,
      headers: headersList,
    });

    const data = await response.text();
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
