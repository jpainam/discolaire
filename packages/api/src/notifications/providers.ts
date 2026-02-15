import { env } from "../env";

//type SmsProvider = "twilio" | "sns" | "vonage";

export async function sendSms(opts: { toPhone: string; bodyText: string }) {
  //const provider = (env.SMS_PROVIDER ?? "twilio") as SmsProvider;
  const provider = env.SMS_PROVIDER;
  if (provider === "twilio") {
    const { sendSmsTwilio } = await import("./twilio");
    return sendSmsTwilio(opts);
  }
  if (provider === "sns") {
    const { sendSmsSns } = await import("./sns");
    return sendSmsSns(opts);
  }
  if (provider === "vonage") {
    const { sendSmsVonage } = await import("./vonage");
    return sendSmsVonage(opts);
  }
  throw new Error(`Unsupported SMS provider: ${provider}`);
}
