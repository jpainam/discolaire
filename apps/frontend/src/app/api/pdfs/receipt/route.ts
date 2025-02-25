import type { NextRequest } from "next/server";
import { z } from "zod";

import { IPBWReceipt, renderToStream } from "@repo/reports";

import { api } from "~/trpc/server";

const searchSchema = z.object({
  preview: z.coerce.boolean().default(true),
  size: z.union([z.literal("letter"), z.literal("a4")]).default("letter"),
  id: z.coerce.number(),
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
    const { id, size, preview } = result.data;

    const transaction = await api.transaction.get(id);
    if (!transaction) {
      return new Response("Transaction not found", { status: 404 });
    }
    const school = await api.school.getSchool();
    const student = await api.student.get(transaction.account.studentId);
    const contacts = await api.student.contacts(transaction.account.studentId);

    const stream = await renderToStream(
      IPBWReceipt({
        transaction: transaction,
        contacts: contacts,
        student: student,
        school: school,
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
        `attachment; filename="Receipt-${student.lastName}-${student.firstName}.pdf"`;
    }

    return new Response(blob, { headers });
  } catch (error) {
    console.error(error);
    return new Response(String(error), { status: 500 });
  }
}
