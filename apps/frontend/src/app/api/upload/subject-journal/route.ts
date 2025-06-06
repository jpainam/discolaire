import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSession } from "~/auth/server";
import { s3client } from "~/lib/s3-client";
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

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return Response.json({ error: "Invalid file type" }, { status: 400 });
    }
    const fileBuffer = await file.arrayBuffer();
    //const isCropped = file.name.includes("cropped");

    const school = await caller.school.getSchool();
    const filename = crypto.randomUUID();
    const key = `${school.code}/journals/${subjectId}/${file.name}_${filename}.${file.type.split("/")[1]}`;

    const command = new PutObjectCommand({
      Bucket: "TODO-UPLOAD",
      Key: key,
      Body: Buffer.from(fileBuffer),
      ContentType: file.type,
    });
    await s3client.send(command);
    return Response.json({
      fileUrl: `https://discolaire-public.s3.eu-central-1.amazonaws.com/${key}`,
    });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
