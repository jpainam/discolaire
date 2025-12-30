import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { z } from "zod/v4";

import { parseSearchParams } from "~/app/api/utils";
import { getSession } from "~/auth/server";
import { IPBWScoringCard } from "~/reports/reportcards/IPBWScoringCard";

const searchSchema = z.object({
  classroomId: z.string().min(1),
  termId: z.string().min(1),
});
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const searchParams = parseSearchParams(req);
  const parsed = searchSchema.safeParse(searchParams);
  if (!parsed.success) {
    const error = z.treeifyError(parsed.error);
    return NextResponse.json(error, { status: 400 });
  }
  const stream = await renderToStream(IPBWScoringCard());

  const headers: Record<string, string> = {
    "Content-Type": "application/pdf",
    "Cache-Control": "no-store, max-age=0",
  };
  // @ts-expect-error TODO: fix this
  return new Response(stream, { headers });
}
