import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import z from "zod/v4";

import { uploadFile } from "~/actions/upload";
import { parseSearchParams } from "~/app/api/utils";
import { getSession } from "~/auth/server";
import { env } from "~/env";
import { deleteFile } from "~/lib/s3-client";
import { caller, getQueryClient, trpc } from "~/trpc/server";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const userId = formData.get("userId") as string | null;
    if (!userId) {
      return Response.json({ error: "User Id missing" }, { status: 400 });
    }

    if (!file) {
      return Response.json({ error: "Data missing" }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return Response.json({ error: "Invalid file type" }, { status: 400 });
    }

    const ext = file.name.split(".").pop();
    const user = await caller.user.get(userId);

    const key = `${user.school.code}/${user.profile}/${userId}.${ext}`;
    const result = await uploadFile({
      file: file,
      bucket: env.S3_AVATAR_BUCKET_NAME,
      destination: key,
    });
    await caller.user.updateAvatar({ id: userId, avatar: result.key });

    // TODO Send an email to the user to confirm the change
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

const searchSchema = z.object({
  userId: z.string().optional(),
  studentId: z.string().optional(),
  contactId: z.string().optional(),
  staffId: z.string().optional(),
});
export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const searchParams = parseSearchParams(request);
    const parsed = searchSchema.safeParse(searchParams);

    if (!parsed.success) {
      const error = z.treeifyError(parsed.error);
      return NextResponse.json(error, { status: 400 });
    }
    const { userId, studentId, contactId, staffId } = parsed.data;
    const queryClient = getQueryClient();

    if (userId) {
      const user = await queryClient.fetchQuery(
        trpc.user.get.queryOptions(userId),
      );
      if (user.profile == "student") {
        const student = await queryClient.fetchQuery(
          trpc.student.getFromUserId.queryOptions(user.id),
        );
        await deleteFromProfile(student.avatar, student.id, "student");
      } else if (user.profile == "staff") {
        const staff = await queryClient.fetchQuery(
          trpc.staff.getFromUserId.queryOptions(user.id),
        );
        await deleteFromProfile(staff.avatar, staff.id, "staff");
      } else if (user.profile == "contact") {
        const contact = await queryClient.fetchQuery(
          trpc.contact.getFromUserId.queryOptions(user.id),
        );
        await deleteFromProfile(contact.avatar, contact.id, "contact");
      }
    }
    if (studentId) {
      const student = await queryClient.fetchQuery(
        trpc.student.get.queryOptions(studentId),
      );
      await deleteFromProfile(student.avatar, student.id, "student");
    } else if (contactId) {
      const contact = await queryClient.fetchQuery(
        trpc.contact.get.queryOptions(contactId),
      );
      await deleteFromProfile(contact.avatar, contact.id, "contact");
    } else if (staffId) {
      const staff = await queryClient.fetchQuery(
        trpc.staff.getFromUserId.queryOptions(staffId),
      );
      await deleteFromProfile(staff.avatar, staff.id, "staff");
    }

    return Response.json({ message: "Avatar deleted successfully" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

async function deleteFromProfile(
  key: string | null,
  id: string,
  profile: "student" | "contact" | "staff",
) {
  if (!key) return;
  await deleteFile({
    bucket: env.S3_AVATAR_BUCKET_NAME,
    key,
  });
  return caller.user.updateAvatar({
    id: id,
    profile: profile,
    avatar: null,
  });
}
