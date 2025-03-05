import type { NextRequest } from "next/server";
import { z } from "zod";

import { AcccountStatement, renderToStream } from "@repo/reports";

import { auth } from "@repo/auth";
import { api } from "~/trpc/server";

const searchSchema = z.object({
  preview: z.coerce.boolean().default(true),
  size: z.union([z.literal("letter"), z.literal("a4")]).default("letter"),
  id: z.string().min(1),
});
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const requestUrl = new URL(req.url);

    const obj: Record<string, string> = {};

    for (const [key, value] of requestUrl.searchParams.entries()) {
      obj[key] = value;
    }

    const result = searchSchema.safeParse(obj);
    if (!result.success) {
      const error = result.error.issues.map((e) => e.message).join(", ");
      return new Response(error, { status: 400 });
    }
    const { id, size, preview } = result.data;

    const student = await api.student.get(id);
    const school = await api.school.getSchool();

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
  } catch (error) {
    console.error(error);
    return new Response(String(error), { status: 500 });
  }
}
