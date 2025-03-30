import { auth } from "@repo/auth/session";
import WelcomeEmail from "@repo/transactional/emails/WelcomeEmail";
import { nanoid } from "nanoid";
import type { NextRequest } from "next/server";
import { createUniqueInvite } from "~/actions/invite";
import { env } from "~/env";
import { resend } from "~/lib/resend";
import { caller } from "~/trpc/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const { id } = await params;
    const studentcontacts = await caller.student.contacts(id);
    const school = await caller.school.getSchool();

    for (const studentContact of studentcontacts) {
      const contact = studentContact.contact;
      if (contact.email) {
        const token = await createUniqueInvite({
          entityId: contact.id,
          entityType: "contact",
        });
        const invitationLink = env.NEXT_PUBLIC_BASE_URL + "/invite/" + token;
        const { error } = await resend.emails.send({
          from: "Feedback <hi@discolaire.com>",
          to: [contact.email],
          subject: "Bienvenue sur " + school.name,
          headers: {
            "X-Entity-Ref-ID": nanoid(),
          },
          react: WelcomeEmail({
            fullName: contact.lastName ?? contact.firstName ?? "N/A",
            url: invitationLink,
          }) as React.ReactElement,
        });
        if (error) {
          return Response.json({ error }, { status: 500 });
        }
      }
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
