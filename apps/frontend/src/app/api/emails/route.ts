import type { NextRequest } from "next/server";
import { getSession } from "~/auth/server";

export async function GET(_req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  return new Response("GET /api/emails");
}
