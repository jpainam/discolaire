import { getSession } from "~/auth/server";

export async function POST(_request: Request) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  return Response.json("ok");
}
