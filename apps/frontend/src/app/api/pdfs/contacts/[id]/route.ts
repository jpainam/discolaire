import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { z } from "zod/v4";

import { getSession } from "~/auth/server";
import { checkPermission } from "~/permissions/server";
import { ContactProfile } from "~/reports/contacts/ContactProfile";
import { caller, getQueryClient, trpc } from "~/trpc/server";

const querySchema = z.object({
  format: z.enum(["pdf", "csv"]).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { id } = await params;
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
    const { format } = parsedQuery.data;
    const contactId = id;
    const queryClient = getQueryClient();
    const school = await caller.school.getSchool();

    const session = await getSession();
    if (session?.user.profile === "student") {
      const student = await caller.student.getFromUserId(session.user.id);
      const contacts = await queryClient.fetchQuery(
        trpc.student.contacts.queryOptions(student.id),
      );
      if (!contacts.map((c) => c.contactId).includes(contactId)) {
        return new Response("Unauthorized access", { status: 500 });
      }
    } else if (session?.user.profile === "contact") {
      const contact = await caller.contact.getFromUserId(session.user.id);
      if (contact.id != contactId) {
        return new Response("Unauthorized access", { status: 500 });
      }
    }
    const canReadContact = await checkPermission("contact.read");
    if (!canReadContact) {
      return new Response("Unauthorized access", { status: 500 });
    }
    const studentContacts = await queryClient.fetchQuery(
      trpc.contact.students.queryOptions(contactId),
    );
    const contact = await queryClient.fetchQuery(
      trpc.contact.get.queryOptions(contactId),
    );

    if (format === "csv") {
      return new Response("Not yet implemented");
    } else {
      const stream = await renderToStream(
        ContactProfile({
          studentContacts,
          contact,
          school: school,
        }),
      );

      //const blob = await new Response(stream).blob();
      const headers: Record<string, string> = {
        "Content-Type": "application/pdf",
        "Cache-Control": "no-store, max-age=0",
      };

      // @ts-expect-error missing types
      return new Response(stream, { headers });
    }
  } catch (error) {
    console.error(error);
    return new Response(String(error), { status: 500 });
  }
}

// function toExcel({
//   classroom,
//   gradesheet,
//   grades,
// }: {
//   classroom: RouterOutputs["classroom"]["get"];
//   gradesheet: NonNullable<RouterOutputs["gradeSheet"]["get"]>;
//   grades: RouterOutputs["gradeSheet"]["grades"];
// }) {
//   const rows = grades.map((gr) => {
//     return {
//       "Nom et Prénom": getFullName(gr.student),
//       Sexe: gr.student.gender == "female" ? "F" : "M",
//       Redoublant: gr.student.isRepeating ? "Oui" : "Non",
//       Note: gr.grade,
//       Absent: gr.isAbsent ? "Oui" : "Non",
//       Appréciation: getAppreciations(gr.grade),
//     };
//   });
//   const worksheet = XLSX.utils.json_to_sheet(rows);
//   const workbook = XLSX.utils.book_new();
//   const sheetName = getSheetName(gradesheet.subject.course.name);
//   XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

//   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//   const u8 = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

//   const blob = new Blob([u8], {
//     type: `${xlsxType};charset=utf-8;`,
//   });
//   const headers: Record<string, string> = {
//     "Content-Type": xlsxType,
//     "Cache-Control": "no-store, max-age=0",
//   };
//   const filename = `Liste-des-notes-${classroom.name}.xlsx`;
//   headers["Content-Disposition"] = `attachment; filename="${filename}"`;

//   return { blob, headers };
// }
