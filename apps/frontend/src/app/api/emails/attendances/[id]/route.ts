import type { NextRequest } from "next/server";

import { getSession } from "~/auth/server";
import { db } from "~/lib/db";
import { caller } from "~/trpc/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return new Response("Not authenticated", { status: 401 });
  }
  try {
    const { id } = await params;
    if (!id) {
      return new Response("L'ID de la presence est obligatoire", {
        status: 401,
      });
    }
    const attendance = await caller.attendance.get(Number(id));
    console.log(attendance);
    await db.attendance.update({
      where: {
        id: Number(id),
      },
      data: {
        notificationSent: true,
      },
    });
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Une erreur s'est produite", { status: 500 });
  }
}
