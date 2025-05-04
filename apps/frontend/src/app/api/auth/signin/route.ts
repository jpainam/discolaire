/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextRequest } from "next/server";
import { z } from "zod";
import { caller } from "~/trpc/server";
const schema = z.object({
  username: z.string(),
  password: z.string(),
});
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Invalid body" }, { status: 400 });
    }
    const { username, password } = parsed.data;

    const result = await caller.auth.signin({ username, password });

    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json({ error: (error as Error).message });
  }
}
