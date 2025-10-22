import { getSession } from "~/auth/server";


export async function POST() {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  return new Response("Ok", { status: 200 });
}