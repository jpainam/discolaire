import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import { z } from "zod/v4";

import { StudentCreatedEmail } from "@repo/transactional/emails/StudentCreatedEmail";

import { getSession } from "~/auth/server";
import { caller } from "~/trpc/server";
import { logger } from "~/utils/logger";

export const runtime = "nodejs";

const schema = z.object({
  studentId: z.string().min(1),
});

const genderLabel = (gender: string) => {
  if (gender === "female") return "Féminin";
  return "Masculin";
};

const formatDate = (date: Date | string | null | undefined) => {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString("fr-FR", {
    timeZone: "UTC",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
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

    const { studentId } = result.data;

    const [student, studentContacts] = await Promise.all([
      caller.student.get(studentId),
      caller.student.contacts(studentId),
    ]);

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const school = student.school;
    const studentName = [student.firstName, student.lastName]
      .filter(Boolean)
      .join(" ");

    const parents = studentContacts.map((sc) => ({
      name: [sc.contact.firstName, sc.contact.lastName]
        .filter(Boolean)
        .join(" "),
      relationship: sc.relationship?.name,
      email: sc.contact.user?.email ?? undefined,
      phone: sc.contact.phoneNumber ?? undefined,
    }));

    const html = await render(
      StudentCreatedEmail({
        studentFirstName: student.firstName,
        studentLastName: student.lastName,
        dateOfBirth: formatDate(student.dateOfBirth),
        gender: genderLabel(student.gender),
        phoneNumber: student.phoneNumber ?? undefined,
        residence: student.residence ?? undefined,
        parents,
        school: {
          id: school.id,
          name: school.name,
          logo: school.logo ?? null,
        },
      }),
    );

    const subject = `Inscription de ${studentName} — Dossier enregistré`;

    const emails = [
      student.user?.email,
      ...studentContacts.map((sc) => sc.contact.user?.email),
    ].filter((email): email is string => Boolean(email));

    const uniqueEmails = [...new Set(emails)];
    if (uniqueEmails.length === 0) {
      return Response.json({ success: true, sent: 0 }, { status: 200 });
    }

    await caller.sesEmail.enqueue({
      jobs: uniqueEmails.map((to) => ({
        to,
        from: `${school.code} <contact@discolaire.com>`,
        subject,
        html,
      })),
    });

    return Response.json(
      { success: true, sent: uniqueEmails.length },
      { status: 200 },
    );
  } catch (error) {
    logger.error("[api/emails/student/create]", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
