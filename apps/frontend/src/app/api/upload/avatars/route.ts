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
  key: z.string().optional(),
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
    const { userId, key } = parsed.data;
    const queryClient = getQueryClient();
    let keyFile = key;
    if (userId) {
      const user = await queryClient.fetchQuery(
        trpc.user.get.queryOptions(userId),
      );
      keyFile = user.avatar ?? undefined;
    }

    if (!keyFile) {
      return Response.json({ error: "No avatar to delete" }, { status: 400 });
    }

    await deleteFile({
      bucket: env.S3_AVATAR_BUCKET_NAME,
      key: keyFile,
    });

    if (userId) {
      await caller.user.updateAvatar({ id: userId, avatar: null });
    } else if (key) {
      // Get user by avatar key
      const secondUser = await queryClient.fetchQuery(
        trpc.photo.getUserByKey.queryOptions({ key }),
      );
      if (secondUser) {
        await caller.user.updateAvatar({ id: secondUser.id, avatar: null });
      }
    }

    return Response.json({ message: "Avatar deleted successfully" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
