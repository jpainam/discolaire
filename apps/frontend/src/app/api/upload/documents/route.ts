import { randomUUID } from "crypto";

import { uploadFiles } from "~/actions/upload";
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
    const file = formData.get("file") as File | null;

    const entityId = formData.get("entityId") as string | null;
    const entityType = formData.get("entityType") as string | null;
    if (!entityId || !entityType) {
      return Response.json({ error: "User Id missing" }, { status: 400 });
    }
    if (!file) {
      return Response.json({ error: "File missing" }, { status: 400 });
    }
    const queryClient = getQueryClient();
    const school = await queryClient.fetchQuery(
      trpc.school.getSchool.queryOptions(),
    );

    const ext = file.name.split(".").pop();
    const key = randomUUID();
    const destination = `${school.code}/${entityType}/${key}.${ext}`;

    const results = await uploadFiles({
      files: [file],
      bucket: env.S3_DOCUMENT_BUCKET_NAME,
      destinations: [destination],
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
    await deleteFile({
      bucket: env.S3_DOCUMENT_BUCKET_NAME,
      key: document.url,
    });

    await caller.document.delete(documentId);

    return Response.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
