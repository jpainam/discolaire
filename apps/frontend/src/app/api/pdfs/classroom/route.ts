import type { NextRequest } from "next/server";
import { z } from "zod";

import { ClassroomStudentList, renderToStream } from "@repo/reports";

import { api } from "~/trpc/server";

const searchSchema = z.object({
  preview: z.coerce.boolean().default(true),
  size: z.union([z.literal("letter"), z.literal("a4")]).default("letter"),
  id: z.string().min(1),
  format: z.union([z.literal("pdf"), z.literal("csv")]).default("pdf"),
});
export async function GET(req: NextRequest) {
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
    const { id, preview } = result.data;

    const students = await api.classroom.students(id);
    const classroom = await api.classroom.get(id);
    const school = await api.school.getSchool();

    const stream = await renderToStream(
      ClassroomStudentList({
        students: students,
        school: school,
        size: "a4",
        classroom: classroom,
      }),
    );

    //const blob = await new Response(stream).blob();
    const headers: Record<string, string> = {
      "Content-Type": "application/pdf",
      "Cache-Control": "no-store, max-age=0",
    };
    const filename = crypto.randomUUID();
    if (!preview) {
      headers["Content-Disposition"] =
        `attachment; filename="Liste-${filename}.pdf"`;
    }

    // @ts-expect-error TODO: fix this
    return new Response(stream, { headers });
  } catch (error) {
    console.error(error);
    return new Response(String(error), { status: 500 });
  }
}
