import { z } from "zod";

import { renderToStream } from "@repo/reports";

import { auth } from "@repo/auth";
import { IPBWTrimestre } from "@repo/reports/reportcards/IPBWTrimestre";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { api } from "~/trpc/server";

const querySchema = z.object({
  trimestreId: z.string().min(1),
  studentId: z.string().min(1),
  format: z.enum(["pdf", "csv"]).optional(),
});
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { id } = params;
  if (!id) {
    return NextResponse.json({ message: "No ID provided", status: 400 });
  }
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const parsedQuery = querySchema.safeParse(searchParams);
  if (!parsedQuery.success) {
    return NextResponse.json(
      { error: parsedQuery.error.format() },
      { status: 400 },
    );
  }
  try {
    const classroom = await api.classroom.get(id);
    const school = await api.school.getSchool();
    const { trimestreId, format, studentId } = parsedQuery.data;
    const student = await api.student.get(studentId);
    const contact = await api.student.getPrimaryContact(studentId);

    console.log({ trimestreId, format });

    const stream = await renderToStream(
      IPBWTrimestre({
        school: school,
        classroom: classroom,
        title: getTitle({ trimestreId }),
        student: student,
        schoolYear: classroom.schoolYear,
        contact: contact,
      }),
    );

    //const blob = await new Response(stream).blob();

    const headers: Record<string, string> = {
      "Content-Type": "application/pdf",
      "Cache-Control": "no-store, max-age=0",
    };

    // @ts-expect-error TODO: fix this
    return new Response(stream, { headers });
  } catch (error) {
    console.error(error);
    return new Response(String(error), { status: 500 });
  }
}

function getTitle({ trimestreId }: { trimestreId: string }) {
  switch (trimestreId) {
    case "trim1":
      return "BULLETIN SCOLAIRE DU PREMIER TRIMESTRE";
    case "trim2":
      return "BULLETIN SCOLAIRE DU SECOND TRIMESTRE";
    case "trim3":
      return "BULLETIN SCOLAIRE DU TROISIEME TRIMESTRE";
    case "ann":
      return "BULLETIN SCOLAIRE ANNUEL";
  }
  return "Bulletin";
}
