/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getSession } from "~/auth/server";
import { db } from "~/lib/db";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { url, userId, size, id, reportApiKey } = await request.json();
  if (reportApiKey !== "EMPTY") {
    return Response.json({ error: "Not authorized" }, { status: 401 });
  }
  if (!url || !userId || !id) {
    return Response.json(
      { error: "Invalid request " + JSON.stringify({ url, userId, id }) },
      { status: 400 },
    );
  }
  try {
    const report = await db.reporting.update({
      where: {
        id: id,
        userId: userId,
      },
      data: {
        url: url,
        size: size,
        status: "COMPLETED",
      },
    });

    return Response.json({ report });
  } catch (error: unknown) {
    return Response.json({ error: (error as Error).message });
  }
}
