import { randomUUID } from "crypto";

import { getSession } from "~/auth/server";
import { env } from "~/env";
import { deleteFile, uploadFiles } from "~/lib/s3-client";
import { caller } from "~/trpc/server";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[] | null;

    const userId = formData.get("userId") as string | null;
    if (!userId) {
      return Response.json({ error: "User Id missing" }, { status: 400 });
    }
    if (!files) {
      return Response.json({ error: "Files missing" }, { status: 400 });
    }
    if (
      !Array.isArray(files) ||
      files.some((file) => !(file instanceof File))
    ) {
      return Response.json({ error: "Invalid file type" }, { status: 400 });
    }
    const user = await caller.user.get(userId);
    const destinations = [];
    for (const file of files) {
      const ext = file.name.split(".").pop();
      const key = randomUUID();
      destinations.push(`${user.school.code}/${user.profile}/${key}.${ext}`);
    }
    const results = await uploadFiles({
      files: files,
      bucket: env.S3_DOCUMENT_BUCKET_NAME,
      destinations: destinations,
    });
    // TODO Send an email to the user to confirm the change
    return Response.json(results);
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
    const { documentId } = (await request.json()) as { documentId: string };
    if (!documentId) {
      return Response.json(
        { error: "No documentId provided" },
        { status: 400 },
      );
    }
    const document = await caller.document.get(documentId);
    await Promise.all(
      document.attachments.map((attachment) =>
        deleteFile({
          bucket: env.S3_DOCUMENT_BUCKET_NAME,
          key: attachment,
        }),
      ),
    );

    return Response.json({ message: "Avatar deleted successfully" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
