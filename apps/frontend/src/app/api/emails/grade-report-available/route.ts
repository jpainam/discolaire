import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import { z } from "zod/v4";

import { getDb } from "@repo/db";
import { enqueueEmailJobs } from "@repo/messaging/client";
import { GradeReportAvailableEmail } from "@repo/transactional";

import { env } from "~/env";
import { getRequestBaseUrl } from "~/lib/base-url.server";

export const runtime = "nodejs";

const schema = z.object({
  tenant: z.string().min(1),
  termId: z.string().min(1),
});

/**
 * POST /api/emails/grade-report-available
 *
 * Manually triggered endpoint to notify all parents that the grade report
 * for a given term is now available. Requires the internal API key.
 *
 * Body: { tenant: string; termId: string }
 */
export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey || apiKey !== env.DISCOLAIRE_API_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body = await req.json();
  const result = schema.safeParse(body);

  if (!result.success) {
    const error = z.treeifyError(result.error);
    return NextResponse.json(error, { status: 400 });
  }

  const { tenant, termId } = result.data;

  try {
    const db = getDb({ connectionString: env.DATABASE_URL, tenant });

    const config = await db.termReportConfig.findUnique({
      where: { termId },
      include: { term: true },
    });

    if (!config) {
      return NextResponse.json(
        { error: "TermReportConfig not found" },
        { status: 404 },
      );
    }

    if (!config.resultPublishedAt) {
      return NextResponse.json(
        { error: "resultPublishedAt is not set for this term" },
        { status: 422 },
      );
    }

    const school = await db.school.findFirst({
      select: { name: true, logo: true },
    });

    // Resolve the default school year (mirrors school-year-service.getDefault)
    const defaultSchoolYear =
      (await db.schoolYear.findFirst({
        where: { isDefault: true },
        orderBy: { startDate: "desc" },
        select: { id: true },
      })) ??
      (await db.schoolYear.findFirst({
        orderBy: { startDate: "desc" },
        select: { id: true },
      }));

    if (!defaultSchoolYear) {
      return NextResponse.json(
        { error: "No school year found" },
        { status: 422 },
      );
    }

    // Collect students enrolled in the default school year with their contacts
    const students = await db.student.findMany({
      where: {
        enrollments: {
          some: { schoolYearId: defaultSchoolYear.id },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        studentContacts: {
          select: {
            contact: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    const termName = config.term.name;
    const resultPublishedAt = config.resultPublishedAt;
    const baseUrl = await getRequestBaseUrl(req.headers);

    const jobs: Parameters<typeof enqueueEmailJobs>[0] = [];

    for (const student of students) {
      const studentName = [student.firstName, student.lastName]
        .filter(Boolean)
        .join(" ");

      const parentEmails = student.studentContacts
        .map((sc) => ({
          email: sc.contact.email,
          name: [sc.contact.firstName, sc.contact.lastName]
            .filter(Boolean)
            .join(" "),
        }))
        .filter((c): c is { email: string; name: string } => Boolean(c.email));

      for (const parent of parentEmails) {
        const html = await render(
          GradeReportAvailableEmail({
            parentName: parent.name || "Parent/Tuteur",
            studentName,
            termName,
            resultPublishedAt,
            school: {
              name: school?.name ?? tenant,
              logo: school?.logo,
            },
            appUrl: baseUrl,
          }),
        );

        jobs.push({
          to: parent.email,
          from: `Discolaire <contact@discolaire.com>`,
          subject: `Bulletin de notes disponible — ${termName} (${studentName})`,
          html,
        });
      }
    }

    if (jobs.length === 0) {
      return NextResponse.json({ success: true, sent: 0 });
    }

    await enqueueEmailJobs(jobs);

    return NextResponse.json({ success: true, sent: jobs.length });
  } catch (error) {
    console.error("[api/emails/grade-report-available]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
