import { getSession } from "~/auth/server";
import { env } from "~/env";
import { uploadFile } from "~/lib/s3-client";
import { caller } from "~/trpc/server";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const subjectId = formData.get("subjectId") as string;
    if (!subjectId) {
      return Response.json(
        { error: "No subject id provided" },
        { status: 400 }
      );
    }
    const subject = await caller.subject.get(Number(subjectId));

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return Response.json({ error: "Invalid file type" }, { status: 400 });
    }

    const filename = crypto.randomUUID();
    const key = `journals/${subject.course.name}/${file.name}_${filename}.${file.type.split("/")[1]}`;

    const result = await uploadFile({
      file: file,
      bucket: env.S3_DOCUMENT_BUCKET_NAME,
      destination: key,
    });

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
