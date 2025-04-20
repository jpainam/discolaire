/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "~/env";

export async function GET(request: Request) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const query = new URL(request.url);
  const searchParams = query.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode && token && challenge && mode == "subscribe") {
    const isValid = token == env.WHATSAPP_VERIFY_TOKEN;
    if (isValid) {
      return new NextResponse(challenge);
    } else {
      return new NextResponse(null, { status: 403 });
    }
  } else {
    return new NextResponse(null, { status: 400 });
  }
}

const GRAPH_API_TOKEN = env.WHATSAPP_API_TOKEN;

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log("Incoming webhook message:", JSON.stringify(body, null, 2));

  const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (message?.type === "text") {
    const business_phone_number_id =
      body.entry?.[0]?.changes?.[0]?.value?.metadata?.phone_number_id;

    // Send reply
    await fetch(
      `https://graph.facebook.com/v22.0/${business_phone_number_id}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GRAPH_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: message.from,
          text: { body: "Echo: " + message.text.body },
          context: {
            message_id: message.id,
          },
        }),
      }
    );

    // Mark as read
    await fetch(
      `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GRAPH_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          status: "read",
          message_id: message.id,
        }),
      }
    );
  }

  return new NextResponse(null, { status: 200 });
}
