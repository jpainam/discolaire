import type { NextRequest } from "next/server";

import { auth } from "@repo/auth";

export async function GET(_req: NextRequest) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  return new Response("GET /api/transaction");
}
