import { render } from "@react-email/render";
import type { NextRequest } from "next/server";

import { FakeGradeReportEmail } from "@repo/transactional";

import { caller } from "~/trpc/server";
import { getSession } from "~/auth/server";

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
    const user = await caller.user.get(id);
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
      await caller.messaging.sendEmail({
        subject: "Signalement de fausse note",
        to: user.email,
        body: emailHtml,
      });
    }
    return Response.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(`An error occurred`, { status: 500 });
  }
}
