/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextRequest } from "next/server";
import { z } from "zod/v4";

import { sendWhatsapp } from "@repo/notification/whatsapp/whatsapp.send";

import { getSession } from "~/auth/server";

const schema = z.object({
  template: z.string(),
});
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Invalid body" }, { status: 400 });
    }
    const { template } = parsed.data;

    const result = await sendWhatsapp({
      recipient: "+14046627457",
      template: template,
      params: [
        { type: "text", text: "Jean Dupont", parameter_name: "student" }, // {{student}}
        { type: "text", text: "Terminale C", parameter_name: "classroom" }, // {{classroom}}
        {
          type: "text",
          text: "Scolarité du mois de mai",
          parameter_name: "fee",
        }, // {{fee}}
        { type: "text", text: "25 000 FCFA", parameter_name: "amount" }, // {{amount}}
        { type: "text", text: "22 avril 2025", parameter_name: "due_date" }, // {{due_date}}
      ],
    });

    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json({ error: (error as Error).message });
  }
}
