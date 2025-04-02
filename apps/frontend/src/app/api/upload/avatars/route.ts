import { PutObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@repo/auth";
import { s3client } from "~/lib/aws-client";
import { caller } from "~/trpc/server";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const userId = formData.get("userId") as string;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return Response.json({ error: "Invalid file type" }, { status: 400 });
    }
    const fileBuffer = await file.arrayBuffer();
    //const isCropped = file.name.includes("cropped");

    const school = await caller.school.getSchool();
    const key = `${school.code}/avatars/${userId}.png`;
    const command = new PutObjectCommand({
      Bucket: "discolaire-public",
      Key: key,
      Body: Buffer.from(fileBuffer),
      ContentType: file.type,
    });
    const response = await s3client.send(command);
    // Update the avatar in the database
    await caller.user.updateAvatar({
      id: userId,
      avatar: `https://discolaire-public.s3.eu-central-1.amazonaws.com/${key}`,
    });
    // TODO Send an email to the user to confirm the change
    return Response.json({ response });
  } catch (error) {
    return Response.json({ error: (error as Error).message });
  }
}
