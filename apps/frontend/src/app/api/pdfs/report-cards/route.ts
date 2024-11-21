import type { NextRequest } from "next/server";
import { z } from "zod";

import { CSABReportCard, renderToStream } from "@repo/reports";

const searchSchema = z.object({
  studentId: z.string().optional(),
  classroomId: z.string().optional(),
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
    const stream = await renderToStream(CSABReportCard({ size: "a4" }));

    const headers: Record<string, string> = {
      "Content-Type": "application/pdf",
      "Cache-Control": "no-store, max-age=0",
    };

    headers["Content-Disposition"] =
      `attachment; filename="CSABReportCard.pdf"`;
    // @ts-expect-error TODO: fix this
    return new Response(stream, { headers });
  } catch (error) {
    console.error(error);
    return new Response(String(error), { status: 500 });
  }
}
