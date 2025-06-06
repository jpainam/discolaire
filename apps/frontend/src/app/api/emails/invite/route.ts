import type { NextRequest } from "next/server";

import InvitationEmail from "@repo/transactional/emails/InvitationEmail";
import { nanoid } from "nanoid";
import { z } from "zod";
import { createUniqueInvite } from "~/actions/invite";
import { getSession } from "~/auth/server";
import { env } from "~/env";
import { resend } from "~/lib/resend";
import { caller } from "~/trpc/server";

const searchSchema = z.object({
  email: z.string().email(),
  entityId: z.string().min(1),
  entityType: z.enum(["staff", "contact", "student"]),
});

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("Not authenticated", { status: 401 });
  }
  const _email = req.nextUrl.searchParams.get("email");
  const _entityId = req.nextUrl.searchParams.get("entityId");
  const _entityType = req.nextUrl.searchParams.get("entityType");

  const result = searchSchema.safeParse({
    email: _email,
    entityId: _entityId,
    entityType: _entityType,
  });
  if (!result.success) {
    const errors = result.error.errors.map((error) => ({
      path: error.path.join("."),
      message: error.message,
    }));

    return Response.json(
      { error: "Invalid request body", errors },
      { status: 400 },
    );
  }
  const school = await caller.school.getSchool();

  const { email, entityId, entityType } = result.data;
  const user = await getNameEmail(entityId, entityType);

  const invitation = await createUniqueInvite({
    entityId: entityId,
    entityType: entityType,
  });

  try {
    const { error } = await resend.emails.send({
      from: `Rejoindre ${school.name} <hi@discolaire.com>`,
      to: [email],
      subject: "Bienvenue sur " + school.name,
      headers: {
        "X-Entity-Ref-ID": nanoid(),
      },
      react: InvitationEmail({
        inviterName: session.user.name,
        inviteeName: user.name,
        schoolName: school.name,
        inviteLink: `${env.NEXT_PUBLIC_BASE_URL}/invite/${invitation}?email=${user.email}`,
      }) as React.ReactElement,
    });
    if (error) {
      return Response.json({ error }, { status: 500 });
    }
    return Response.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(`An error occurred`, { status: 500 });
  }
}

async function getNameEmail(
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
