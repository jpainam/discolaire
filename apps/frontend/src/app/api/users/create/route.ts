/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { z } from "zod";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { caller } from "~/trpc/server";
import { getSession } from "~/auth/server";

const schema = z.object({
  entityId: z.string().min(1),
  entityType: z.enum(["student", "staff", "contact"]),
});
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const body = await req.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      const errors = result.error.format();
      console.error(errors);
      return NextResponse.json(
        { error: result.error.format() },
        { status: 400 },
      );
    }
    const { entityId, entityType } = result.data;
    const user = await caller.user.createAutoUser({
      entityId,
      entityType,
      name: (await getName(entityId, entityType)).name,
    });

    return Response.json(user, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}

async function getName(
  entityId: string,
  entityType: "staff" | "contact" | "student",
) {
  if (entityType == "staff") {
    const s = await caller.staff.get(entityId);
    return {
      name: s.lastName + " " + s.firstName,
      email: s.email,
    };
  }
  if (entityType == "contact") {
    const c = await caller.contact.get(entityId);
    return {
      name: c.lastName + " " + c.firstName,
      email: c.email,
    };
  }

  const st = await caller.student.get(entityId);
  return {
    name: st.lastName + " " + st.firstName,
    email: st.email,
  };
}
