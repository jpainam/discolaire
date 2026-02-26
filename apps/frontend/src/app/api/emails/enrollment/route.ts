import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import { z } from "zod/v4";

import { getDb } from "@repo/db";
import { enqueueEmailJobs } from "@repo/messaging/client";
import { EnrollmentEmail } from "@repo/transactional/emails/EnrollmentEmail";

import { env } from "~/env";
import { getRequestBaseUrl } from "~/lib/base-url.server";
import { createUnsubscribeToken } from "~/lib/unsubscribe-token";

export const runtime = "nodejs";

const schema = z.object({
  tenant: z.string().min(1),
  studentId: z.string().min(1),
  classroomId: z.string().min(1),
  schoolYearId: z.string().min(1),
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

    const { tenant, studentId, classroomId, schoolYearId } = result.data;

    const db = getDb({ connectionString: env.DATABASE_URL, tenant });

    const [student, classroom, schoolYear, school] = await Promise.all([
      db.student.findUnique({
        where: { id: studentId },
        include: {
          user: true,
          studentContacts: { include: { contact: true } },
        },
      }),
      db.classroom.findUnique({ where: { id: classroomId } }),
      db.schoolYear.findUnique({ where: { id: schoolYearId } }),
    ]).then(async ([s, cl, sy]) => {
      if (!s || !cl || !sy) return [null, null, null, null] as const;
      const sc = await db.school.findUnique({ where: { id: s.schoolId } });
      return [s, cl, sy, sc] as const;
    });

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!student || !classroom || !schoolYear || !school) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const studentName = [student.firstName, student.lastName]
      .filter(Boolean)
      .join(" ");

    const html = await render(
      EnrollmentEmail({
        studentName,
        classroomName: classroom.name,
        schoolYearName: schoolYear.name,
        school: { id: school.id, name: school.name, logo: school.logo },
      }),
    );

    const subject = `Inscription de ${studentName} - ${classroom.name} (${schoolYear.name})`;

    const emails = [
      student.user?.email,
      ...student.studentContacts.map((sc) => sc.contact.email),
    ].filter((email): email is string => Boolean(email));

    const uniqueEmails = [...new Set(emails)];
    if (uniqueEmails.length === 0) {
      return Response.json({ success: true, sent: 0 }, { status: 200 });
    }

    const baseUrl = await getRequestBaseUrl(req.headers);

    await enqueueEmailJobs(
      uniqueEmails.map((to) => {
        const token = createUnsubscribeToken(
          "NEW_ENROLLMENT",
          to,
          tenant,
          env.AUTH_SECRET,
        );
        return {
          to,
          from: `${school.code} <contact@discolaire.com>`,
          subject,
          html,
          unsubscribeUrl: `${baseUrl}/api/emails/unsubscribe?token=${token}`,
        };
      }),
    );

    return Response.json(
      { success: true, sent: uniqueEmails.length },
      { status: 200 },
    );
  } catch (error) {
    console.error("[api/emails/enrollment]", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
