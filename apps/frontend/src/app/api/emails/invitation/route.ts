import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import { z } from "zod/v4";

import InvitationEmail from "@repo/transactional/emails/InvitationEmail";

import { getSession } from "~/auth/server";
import { caller, getQueryClient, trpc } from "~/trpc/server";

const schema = z.object({
  url: z.string().min(1),
  email: z.email(),
  name: z.string().min(1),
  userId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = await req.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      const error = z.treeifyError(result.error);
      return NextResponse.json(error, { status: 400 });
    }
    const { url, email, name, userId } = result.data;
    const queryClient = getQueryClient();
    const user = await queryClient.fetchQuery(
      trpc.user.get.queryOptions(userId),
    );

    const html = await render(
      InvitationEmail({
        inviteeName: name,
        schoolName: user.school.name,
        inviteLink: `${url}&id=${userId}`,
        logo: user.school.logo ?? "",
      }),
    );

    await caller.sesEmail.enqueue({
      jobs: [
        {
          to: email,
          from: "Discolaire <contact@discolaire.com>",
          subject: "Invitation " + user.school.name,
          html,
        },
      ],
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
