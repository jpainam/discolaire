import type { NextRequest } from "next/server";

import { AcccountStatement, renderToStream } from "@repo/reports";

import { api } from "~/trpc/server";

export const preferredRegion = ["fra1", "sfo1", "iad1"];
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const id = requestUrl.searchParams.get("id");
  const size = requestUrl.searchParams.get("size") as "letter" | "a4";
  const preview = requestUrl.searchParams.get("preview") === "true";

  if (!id) {
    return new Response("No student id provided", { status: 400 });
  }
  const student = await api.student.get(id);
  const school = await api.school.getSchool();
  if (!school) {
    return new Response("No school found", { status: 400 });
  }

  const data = await api.studentAccount.getStatements({ studentId: id });

  const stream = await renderToStream(
    await AcccountStatement({
      student: student,
      school: school,
      transactions: data,
      size: size,
    }),
  );

  // @ts-expect-error TODO: fix this
  const blob = await new Response(stream).blob();

  const headers: Record<string, string> = {
    "Content-Type": "application/pdf",
    "Cache-Control": "no-store, max-age=0",
  };

  if (!preview) {
    headers["Content-Disposition"] =
      `attachment; filename="Account-${student.lastName}-${student.firstName}.pdf"`;
  }

  return new Response(blob, { headers });
}
