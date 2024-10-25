import type { NextRequest } from "next/server";
import { Resend } from "resend";

import { env } from "~/env";

const resend = new Resend(env.RESEND_API_KEY);

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  console.log("requestUrl", requestUrl);
  console.log("Testing seneding");
  const { data, error } = await resend.emails.send({
    from: "Discolaire <no-reply@discolaire.com>",
    to: ["jpainam@gmail.com"],
    subject: "Running Discolaire",
    html: "<h1>Running Discolaire</h1>",
    //react: EmailTemplate({ firstName: "John" }),
  });
  console.log("data", data);

  if (error) {
    return new Response(error.message, { status: 400 });
  }
  return Response.json(data, { status: 200 });
}
