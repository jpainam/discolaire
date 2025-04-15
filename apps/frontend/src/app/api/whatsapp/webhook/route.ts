import { env } from "~/env";

export async function GET(request: Request) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");
  if (mode === "subscribe" && token === env.WHATSAPP_VERIFY_TOKEN) {
    console.log("mode", mode);
    console.log("token", token);
    console.log("challenge", challenge);
    console.log("Webhook verified successfully");
    return new Response(challenge, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } else {
    console.log("mode", mode);
    console.log("token", token);
    console.log("challenge", challenge);
    return new Response("ok", {
      status: 403,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body = await request.json();
  console.log("body", body);
  console.log("url", url);
  return new Response("ok");
}
