import type { NextRequest } from "next/server";
import { z } from "zod";

import { renderToStream } from "@react-pdf/renderer";
import { getSession } from "~/auth/server";
import { SummaryOfResult } from "~/reports/gradereports/SummaryOfResult";
import { caller } from "~/trpc/server";

const searchSchema = z.object({
  termId: z.coerce.number(),
  classroomId: z.string().min(1),
  format: z.union([z.literal("pdf"), z.literal("csv")]).default("pdf"),
});
export async function GET(req: NextRequest) {
  const session = await getSession();
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
    const { termId, classroomId, format } = result.data;
    const report = await caller.reportCard.getSequence({
      classroomId: classroomId,
      termId: termId,
    });
    const { globalRanks } = report;
    const students = await caller.classroom.students(classroomId);
    const classroom = await caller.classroom.get(classroomId);
    const term = await caller.term.get(Number(termId));
    if (format === "csv") {
      //const { blob, headers } = toExcel({ stats });
      //return new Response(blob, { headers });
      return new Response(
        JSON.stringify({
          error: "CSV format is not supported for this report type.",
        }),
        { status: 400 },
      );
    } else {
      const stream = await renderToStream(
        await SummaryOfResult({
          globalRanks: globalRanks,
          students: students,
          classroom: classroom,
          term: term,
        }),
      );
      //const blob = await new Response(stream).blob();
      const headers: Record<string, string> = {
        "Content-Type": "application/pdf",
        "Cache-Control": "no-store, max-age=0",
      };
      // @ts-expect-error TODO: fix this
      return new Response(stream, { headers });
    }
  } catch (error) {
    console.error(error);
    return new Response(String(error), { status: 500 });
  }
}
