import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import { z } from "zod/v4";

import { getDb } from "@repo/db";
import { enqueueEmailJobs } from "@repo/messaging/client";
import { StudentContactLinkedEmail } from "@repo/transactional/emails/StudentContactLinkedEmail";

import { env } from "~/env";
import { logger } from "~/utils/logger";

export const runtime = "nodejs";

const schema = z.object({
  tenant: z.string().min(1),
  studentId: z.string().min(1),
  contactId: z.string().min(1),
  relationshipId: z.number().optional(),
});

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey || apiKey !== env.DISCOLAIRE_API_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = await req.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      const error = z.treeifyError(result.error);
      return NextResponse.json(error, { status: 400 });
    }

    const { tenant, studentId, contactId, relationshipId } = result.data;

    const db = getDb({ connectionString: env.DATABASE_URL, tenant });

    const [student, contact] = await Promise.all([
      db.student.findUnique({
        where: { id: studentId },
        include: { user: true },
      }),
      db.contact.findUnique({
        where: { id: contactId },
        include: { user: true },
      }),
    ]);

    if (!student || !contact) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const contactEmail = contact.email ?? contact.user?.email;
    if (!contactEmail) {
      return Response.json({ success: true, sent: 0 }, { status: 200 });
    }

    const [school, relationship] = await Promise.all([
      db.school.findUnique({ where: { id: student.schoolId } }),
      relationshipId
        ? db.contactRelationship.findUnique({ where: { id: relationshipId } })
        : Promise.resolve(null),
    ]);

    if (!school) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    const studentName = [student.firstName, student.lastName]
      .filter(Boolean)
      .join(" ");
    const contactName = [contact.firstName, contact.lastName]
      .filter(Boolean)
      .join(" ");

    const html = await render(
      StudentContactLinkedEmail({
        studentName,
        contactName,
        relationshipName: relationship?.name ?? undefined,
        school: { id: school.id, name: school.name, logo: school.logo },
      }),
    );

    const subject = `Lien établi avec ${studentName} — ${school.name}`;

    await enqueueEmailJobs([
      {
        to: contactEmail,
        from: `${school.code} <contact@discolaire.com>`,
        subject,
        html,
      },
    ]);

    return Response.json({ success: true, sent: 1 }, { status: 200 });
  } catch (error) {
    logger.error("[api/emails/student-contact/link]", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
