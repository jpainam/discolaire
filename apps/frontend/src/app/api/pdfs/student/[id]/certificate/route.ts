import type { NextRequest } from "next/server";
import { renderToStream } from "@react-pdf/renderer";

import { getSession } from "~/auth/server";
import { StudentCertificate } from "~/reports/students/StudentCertificate";
import { caller } from "~/trpc/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 403 });
  }
  const id = (await params).id;

  if (!id) {
    return new Response("Wrong input", { status: 500 });
  }

  const student = await caller.student.get(id);
  const schoolYear = await caller.schoolYear.getCurrent();

  const school = await caller.school.getSchool();

  const stream = await renderToStream(
    StudentCertificate({
      student: student,
      schoolYear: schoolYear,
      school: school,
    }),
  );

  //const blob = await new Response(stream).blob();
  const headers: Record<string, string> = {
    "Content-Type": "application/pdf",
    "Cache-Control": "no-store, max-age=0",
  };

  //   headers["Content-Disposition"] =
  //     `attachment; filename="Certificate-${getFullName(student)}.pdf"`;

  // @ts-expect-error TODO: fix this
  return new Response(stream, { headers });
}
