import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import { z } from "zod/v4";

import { StudentCreatedEmail } from "@repo/transactional/emails/StudentCreatedEmail";

import { getSession } from "~/auth/server";
import { getStudentEmailRecipients } from "~/lib/email";
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

    const [student, studentContacts, emails] = await Promise.all([
      caller.student.get(studentId),
      caller.student.contacts(studentId),
      getStudentEmailRecipients(studentId),
    ]);

    if (emails.length === 0) {
      return Response.json({ success: true, sent: 0 }, { status: 200 });
    }

    const school = await caller.school.get(student.schoolId);

    const parents = studentContacts.map((sc) => ({
      name: [sc.contact.firstName, sc.contact.lastName]
        .filter(Boolean)
        .join(" "),
      relationship: sc.relationship?.name,
      email: sc.contact.user?.email ?? sc.contact.email ?? undefined,
      phone: sc.contact.phoneNumber1 ?? sc.contact.phoneNumber2 ?? undefined,
    }));

    const html = await render(
      StudentCreatedEmail({
        studentFirstName: student.firstName ?? "",
        studentLastName: student.lastName ?? "",
        dateOfBirth: formatDate(student.dateOfBirth),
        gender: genderLabel(student.gender ?? "male"),
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

    const subject = `Inscription de ${student.firstName} ${student.lastName} — Dossier enregistré`;

    await caller.sesEmail.enqueue({
      jobs: emails.map((to) => ({
        to,
        from: `${school.code} <contact@discolaire.com>`,
        subject,
        html,
      })),
    });

    return Response.json(
      { success: true, sent: emails.length },
      { status: 200 },
    );
  } catch (error) {
    logger.error("[api/emails/student/create]", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
