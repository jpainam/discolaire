import { Auth } from "@vonage/auth";
import { SMS } from "@vonage/sms";

import { env } from "../env";

const credentials = new Auth({
  apiKey: env.VONAGE_API_KEY,
  apiSecret: env.VONAGE_API_SECRET,
});
const options = {};

const vonageFrom = env.VONAGE_SMS_FROM;
const smsClient = new SMS(credentials, options);

export async function sendSmsVonage(opts: {
  toPhone: string;
  bodyText: string;
}) {
  if (!vonageFrom) {
    throw new Error("No Vonage From Number");
  }
  const data = await smsClient.send({
    text: opts.bodyText,
    to: opts.toPhone,
    from: vonageFrom,
  });

  const first = data.messages[0];
  if (first?.errorText) {
    throw new Error(`Vonage SMS failed: ${first.errorText}`);
  }

  return {
    provider: "VONAGE",
    providerMsgId: first?.messageId ?? "unknown",
  };
}
