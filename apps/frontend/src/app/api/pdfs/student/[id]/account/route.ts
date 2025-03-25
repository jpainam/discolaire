import type { NextRequest } from "next/server";

import { AcccountStatement, renderToStream } from "@repo/reports";

import { auth } from "@repo/auth";
import { api } from "~/trpc/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const { id } = await params;
    const student = await api.student.get(id);
    const school = await api.school.getSchool();

    const data = await api.studentAccount.getStatements({ studentId: id });

    const stream = await renderToStream(
      await AcccountStatement({
        student: student,
        school: school,
        transactions: data,
      }),
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
