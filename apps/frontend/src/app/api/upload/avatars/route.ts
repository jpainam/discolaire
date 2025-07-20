import { db } from "@repo/db";

import { getSession } from "~/auth/server";
import { env } from "~/env";
import { deleteFile, uploadFile } from "~/lib/s3-client";
import { caller } from "~/trpc/server";

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

    const key = `${user.profile}/${userId}.${ext}`;
    const result = await uploadFile({
      file: file,
      bucket: env.S3_AVATAR_BUCKET_NAME,
      destination: key,
    });
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        avatar: result.key,
      },
    });
    // TODO Send an email to the user to confirm the change
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const { userId } = (await request.json()) as { userId: string };
    if (!userId) {
      return Response.json({ error: "No userId provided" }, { status: 400 });
    }
    const user = await caller.user.get(userId);

    const avatar = user.avatar;
    if (!avatar) {
      return Response.json({ error: "No avatar to delete" }, { status: 400 });
    }

    await deleteFile({
      bucket: env.S3_AVATAR_BUCKET_NAME,
      key: avatar,
    });

    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        avatar: null,
      },
    });

    return Response.json({ message: "Avatar deleted successfully" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
