import { env } from "../env";

export async function sendWhatsapp({
  recipient,
  template,
  params,
}: {
  recipient: string;
  template: string;
  params: Record<string, string>[];
}) {
  const response = await fetch(
    `https://graph.facebook.com/v22.0/${env.WHATSAPP_BUSINESS_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.WHATSAPP_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: recipient,
        type: "template",
        template: {
          name: template,
          language: { code: "fr" },
          components: [
            {
              type: "body",
              parameters: params,
            },
          ],
        },
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Failed to send message:", data);
  } else {
    console.log("Message sent successfully:", data);
  }
}
