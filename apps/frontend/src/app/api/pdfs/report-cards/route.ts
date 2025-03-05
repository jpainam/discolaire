import type { NextRequest } from "next/server";
import { z } from "zod";

import { CSAB, renderToStream } from "@repo/reports";

import { auth } from "@repo/auth";
import { api } from "~/trpc/server";

const searchSchema = z.object({
  studentId: z.string().optional(),
  classroomId: z.string().optional(),
  format: z.union([z.literal("pdf"), z.literal("csv")]).default("pdf"),
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
    const school = await api.school.getSchool();
    const stream = await renderToStream(CSAB({ size: "a4", school: school }));

    const headers: Record<string, string> = {
      "Content-Type": "application/pdf",
      "Cache-Control": "no-store, max-age=0",
    };

    //headers["Content-Disposition"] =
    // `attachment; filename="CSABReportCard.pdf"`;
    // @ts-expect-error TODO: fix this
    return new Response(stream, { headers });
  } catch (error) {
    console.error(error);
    return new Response(String(error), { status: 500 });
  }
}
