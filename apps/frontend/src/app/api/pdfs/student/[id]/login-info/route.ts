import { auth } from "@repo/auth";
import { renderToStream } from "@repo/reports";
import { LoginInfo } from "@repo/reports/students/LoginInfo";
import type { NextRequest } from "next/server";
import { getServerTranslations } from "~/i18n/server";
import { caller } from "~/trpc/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const { id } = await params;

    const { t } = await getServerTranslations();
    const student = await caller.student.get(id);
    const studentcontacts = await caller.student.contacts(id);
    const school = await caller.school.get(student.schoolId);
    const stream = await renderToStream(
      await LoginInfo({
        student: student,
        school: school,
        contacts: studentcontacts,
      })
    );

    // @ts-expect-error TODO: fix this
    const blob = await new Response(stream).blob();
    const headers: Record<string, string> = {
      "Content-Type": "application/pdf",
      "Cache-Control": "no-store, max-age=0",
    };

    return new Response(blob, { headers });
  } catch (error) {
    console.error(error);
    return new Response(String(error), { status: 500 });
  }
}
