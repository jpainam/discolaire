import type { NextRequest } from "next/server";

import { auth } from "@repo/auth";
import { CSABReportCard, renderToStream } from "@repo/reports";

export const preferredRegion = ["fra1", "sfo1", "iad1"];
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const _id = requestUrl.searchParams.get("id");
  const size = (requestUrl.searchParams.get("size") ?? "letter") as
    | "letter"
    | "a4";
  const preview = requestUrl.searchParams.get("preview") === "true";

  const session = await auth();
  if (!session) {
    return new Response("Not authenticated", { status: 401 });
  }

  //const school = await api.school.getSchool();

  const stream = await renderToStream(CSABReportCard({ size: size }));

  // @ts-expect-error TODO: fix this
  const blob = await new Response(stream).blob();

  const headers: Record<string, string> = {
    "Content-Type": "application/pdf",
    "Cache-Control": "no-store, max-age=0",
  };

  if (!preview) {
    headers["Content-Disposition"] =
      `attachment; filename="Account-CSABReportCard.pdf"`;
  }

  return new Response(blob, { headers });
}
