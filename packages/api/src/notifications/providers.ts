import { env } from "../env";
import { sendSmsSns } from "./sns";
import { sendSmsTwilio } from "./twilio";
import { sendSmsVonage } from "./vonage";

//type SmsProvider = "twilio" | "sns" | "vonage";

export async function sendSms(opts: { toPhone: string; bodyText: string }) {
  //const provider = (env.SMS_PROVIDER ?? "twilio") as SmsProvider;
  const provider = env.SMS_PROVIDER;
  if (provider === "twilio") return sendSmsTwilio(opts);
  if (provider === "sns") return sendSmsSns(opts);
  if (provider === "vonage") return sendSmsVonage(opts);
  throw new Error(`Unsupported SMS provider: ${provider}`);
}
