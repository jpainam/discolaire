import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { z } from "zod/v4";

import { TermType } from "@repo/db";

import { parseSearchParams } from "~/app/api/utils";
import { getSession } from "~/auth/server";
import { ClassroomSummaryReport } from "~/reports/gradereports/ClassroomSummaryReport";
import { ClassroomSummaryReportTrimestre } from "~/reports/gradereports/ClassroomSummaryReportTrimestre";
import { caller, getQueryClient, trpc } from "~/trpc/server";

const searchSchema = z.object({
  termId: z.string().min(1),
  classroomId: z.string().min(1),
  format: z.union([z.literal("pdf"), z.literal("csv")]).default("pdf"),
});
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const searchParams = parseSearchParams(req);

    const result = searchSchema.safeParse(searchParams);
    if (!result.success) {
      const error = z.treeifyError(result.error);
      return NextResponse.json(error, { status: 400 });
    }
    const { termId, classroomId, format } = result.data;

    const queryClient = getQueryClient();
    const term = await queryClient.fetchQuery(
      trpc.term.get.queryOptions(termId),
    );
    const subjects = await queryClient.fetchQuery(
      trpc.classroom.subjects.queryOptions(classroomId),
    );

    const students = await queryClient.fetchQuery(
      trpc.classroom.students.queryOptions(classroomId),
    );
    const classroom = await queryClient.fetchQuery(
      trpc.classroom.get.queryOptions(classroomId),
    );

    const school = await queryClient.fetchQuery(
      trpc.school.getSchool.queryOptions(),
    );

    const disciplines = await caller.discipline.sequence({
      classroomId,
      termId,
    });

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
      const headers: Record<string, string> = {
        "Content-Type": "application/pdf",
        "Cache-Control": "no-store, max-age=0",
      };
      if (term.type == TermType.MONTHLY) {
        const term = await queryClient.fetchQuery(
          trpc.term.get.queryOptions(termId),
        );
        const report = await caller.reportCard.getSequence({
          classroomId,
          termId,
        });
        const stream = await renderToStream(
          ClassroomSummaryReport({
            classroom,
            subjects,
            disciplines,
            report,
            students,
            school,
            title: term.name,
          }),
        );
        // @ts-expect-error TODO: fix this
        return new Response(stream, { headers });
      } else if (term.type == TermType.QUARTER) {
        const report = await queryClient.fetchQuery(
          trpc.reportCard.getTrimestre.queryOptions({
            classroomId,
            termId,
          }),
        );
        const stream = await renderToStream(
          ClassroomSummaryReportTrimestre({
            classroom,
            subjects,
            disciplines,
            report,
            students,
            school,
            trimestreId: termId,
          }),
        );
        // @ts-expect-error TODO: fix this
        return new Response(stream, { headers });
      } else {
        return NextResponse.json(`Term type ${term.type} not supported`, {
          status: 400,
        });
      }
    }
  } catch (error) {
    console.error(error);
    return new Response(String(error), { status: 500 });
  }
}
