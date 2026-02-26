import { render } from "@react-email/render";
import { z } from "zod/v4";

import { QuarterlyAttendanceSummaryEmail } from "@repo/transactional";

import { getSession } from "~/auth/server";
import { caller } from "~/trpc/server";

export const runtime = "nodejs";

const attendanceItemSchema = z.object({
  studentId: z.string().min(1),
  absence: z.number().int().nonnegative(),
  justifiedAbsence: z.number().int().nonnegative(),
  late: z.number().int().nonnegative(),
  justifiedLate: z.number().int().nonnegative(),
  consigne: z.number().int().nonnegative(),
  chatter: z.number().int().nonnegative(),
  exclusion: z.number().int().nonnegative(),
});

const bodySchema = z.object({
  classroomId: z.string().min(1),
  termId: z.string().min(1),
  attendances: z.array(attendanceItemSchema).min(1),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) {
      const error = z.treeifyError(result.error).errors;
      return new Response(JSON.stringify(error), { status: 400 });
    }

    const { classroomId, termId, attendances } = result.data;

    const [classroom, term, school] = await Promise.all([
      caller.classroom.get(classroomId),
      caller.term.get(termId),
      caller.school.getSchool(),
    ]);

    const schoolInfo = {
      id: school.id,
      name: school.name,
      logo: school.logo ?? undefined,
    };

    const jobs: {
      to: string;
      from: string;
      subject: string;
      html: string;
    }[] = [];

    await Promise.all(
      attendances.map(async (item) => {
        const { studentId, ...counts } = item;

        // Only email if at least one count is non-zero
        if (
          counts.absence === 0 &&
          counts.late === 0 &&
          counts.consigne === 0 &&
          counts.chatter === 0 &&
          counts.exclusion === 0
        ) {
          return;
        }

        const contacts = await caller.student.contacts(studentId);
        const emails = contacts
          .map((c) => c.contact.user?.email ?? c.contact.email ?? "")
          .filter((e): e is string => e.trim() !== "");

        if (emails.length === 0) return;

        const student = await caller.student.get(studentId);
        const studentName = [student.firstName, student.lastName]
          .filter(Boolean)
          .join(" ");

        const html = await render(
          QuarterlyAttendanceSummaryEmail({
            studentName,
            classroomName: classroom.name,
            termName: term.name,
            school: schoolInfo,
            ...counts,
          }),
        );

        const subject = `Bilan de présence - ${term.name} - ${studentName}`;

        const uniqueEmails = [...new Set(emails)];
        for (const to of uniqueEmails) {
          jobs.push({
            to,
            from: `${school.code} <contact@discolaire.com>`,
            subject,
            html,
          });
        }
      }),
    );

    if (jobs.length === 0) {
      return Response.json({ success: true, sent: 0 });
    }

    await caller.sesEmail.enqueue({ jobs });

    return Response.json({ success: true, sent: jobs.length });
  } catch (error) {
    console.error("[api/emails/attendance-summary]", error);
    return new Response("An error occurred", { status: 500 });
  }
}
