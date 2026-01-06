import { Twilio } from "twilio";

import { env } from "../env";

const accountSid = env.TWILIO_ACCOUNT_SID;
const client = new Twilio(accountSid, env.TWILIO_AUTH_TOKEN);
const twilioFrom = env.TWILIO_SMS_FROM;
export async function sendSmsTwilio(opts: {
  toPhone: string;
  bodyText: string;
}) {
  const data = await client.messages.create({
    body: opts.bodyText,
    to: opts.toPhone,
    from: twilioFrom,
  });
  return {
    provider: "TWILIO",
    providerMsgId: data.sid,
  };
}
