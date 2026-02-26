import { render } from "@react-email/render";
import { z } from "zod/v4";

import { GradeCreatedEmail } from "@repo/transactional";

import { getSession } from "~/auth/server";
import { caller } from "~/trpc/server";

const schema = z.object({
  gradeSheetId: z.coerce.number(),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return new Response("Not authenticated", { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = await req.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      const error = z.treeifyError(result.error).errors;
      return new Response(JSON.stringify(error), { status: 400 });
    }

    const { gradeSheetId } = result.data;

    const [gradeSheet, school] = await Promise.all([
      caller.gradeSheet.get(gradeSheetId),
      caller.school.getSchool(),
    ]);

    const classroomId = gradeSheet.subject.classroomId;

    const [grades, classroom] = await Promise.all([
      caller.gradeSheet.grades(gradeSheetId),
      caller.classroom.get(classroomId),
    ]);

    if (grades.length === 0) {
      return Response.json({ success: true, sent: 0 }, { status: 200 });
    }

    const contactLists = await Promise.all(
      grades.map((g) => caller.student.contacts(g.studentId)),
    );

    const skippedNoEmail: string[] = [];
    // Key: `${email}::${studentId}` — one email per parent per child
    const jobMap = new Map<
      string,
      {
        email: string;
        parentName?: string;
        studentName: string;
        grade: number;
        isAbsent: boolean;
      }
    >();

    grades.forEach((g, index) => {
      const studentName = [g.student.lastName, g.student.firstName]
        .filter(Boolean)
        .join(" ");
      const contacts = contactLists[index] ?? [];

      for (const studentContact of contacts) {
        const contact = studentContact.contact;
        const email = (contact.user?.email ?? contact.email ?? "").trim();
        const parentName =
          [contact.lastName, contact.firstName].filter(Boolean).join(" ") ||
          undefined;

        if (!email) {
          skippedNoEmail.push(parentName ?? contact.id);
          continue;
        }
        const key = `${email}::${g.studentId}`;
        if (!jobMap.has(key)) {
          jobMap.set(key, {
            email,
            parentName,
            studentName,
            grade: g.grade,
            isAbsent: g.isAbsent ?? false,
          });
        }
      }
    });

    const recipients = Array.from(jobMap.values());

    if (recipients.length === 0) {
      return Response.json({ success: true, sent: 0 }, { status: 200 });
    }

    const courseName = gradeSheet.subject.course.name;
    const classroomName = classroom.name;
    const termName = gradeSheet.term.name;
    const subject = `[Notes] ${courseName} - ${gradeSheet.name} (${termName})`;

    const jobs = await Promise.all(
      recipients.map(async (recipient) => ({
        to: recipient.email,
        from: `${school.code} <contact@discolaire.com>`,
        subject,
        html: await render(
          GradeCreatedEmail({
            studentName: recipient.studentName,
            parentName: recipient.parentName,
            gradeSheetName: gradeSheet.name,
            courseName,
            classroomName,
            termName,
            scale: gradeSheet.scale,
            grade: recipient.grade,
            isAbsent: recipient.isAbsent,
            school: { name: school.name, logo: school.logo },
          }),
        ),
      })),
    );

    await caller.sesEmail.enqueue({ jobs });

    return Response.json(
      { success: true, sent: recipients.length, skippedNoEmail },
      { status: 200 },
    );
  } catch (error) {
    console.error("[api/emails/grades]", error);
    return new Response("An error occurred", { status: 500 });
  }
}
