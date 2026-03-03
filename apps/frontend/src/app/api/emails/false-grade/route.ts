import type { NextRequest } from "next/server";
import { render } from "@react-email/render";

import { FakeGradeReportEmail } from "@repo/transactional";

import { getSession } from "~/auth/server";
import { caller } from "~/trpc/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return new Response("Not authenticated", { status: 401 });
    }
    const requestUrl = new URL(req.url);
    const id = requestUrl.searchParams.get("id");
    if (!id) {
      return new Response("Invalid request", { status: 400 });
    }
    const [user, school] = await Promise.all([
      caller.user.get(id),
      caller.school.getSchool(),
    ]);
    if (user.email) {
      const emailHtml = await render(
        FakeGradeReportEmail({
          studentName: user.username,
          reportedBy: "Admin",
          gradeDetails: {
            grade: "A",
            subject: "Math",
            date: "2022-01-01",
          },
          reportComment: "This is a fake  grade report",
        }),
      );

      await caller.sesEmail.enqueue({
        jobs: [
          {
            to: user.email,
            from: `${school.name} <contact@discolaire.com>`,
            subject: "Signalement de fausse note",
            html: emailHtml,
          },
        ],
      });
    }
    return Response.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(`An error occurred`, { status: 500 });
  }
}
