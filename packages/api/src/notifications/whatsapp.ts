import { env } from "../env";

const phoneNumberId = env.WHATSAPP_BUSINESS_PHONE_NUMBER_ID;
const whatsappToken = env.WHATSAPP_API_TOKEN;
export async function sendWhatsapp(opts: {
  toPhone: string;
  bodyText: string;
}) {
  const url = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;
  const payload = {
    messaging_product: "whatsapp",
    //recipient_type: "individual",
    to: opts.toPhone,
    type: "text",
    text: { body: opts.bodyText },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${whatsappToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as {
    messages?: { id: string }[];
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new Error(
      `WhatsApp send failed: ${data.error?.message ?? response.statusText}`,
    );
  }

  return {
    provider: "WHATSAPP_CLOUD",
    providerMsgId: data.messages?.[0]?.id ?? "unknown",
  };
}
