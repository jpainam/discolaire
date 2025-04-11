import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@repo/auth";
import { env } from "~/env";
import { s3client, uploadFile } from "~/lib/s3-client";
import { caller } from "~/trpc/server";

export async function POST(request: Request) {
  console.log("✅ POST /api/upload/logo");
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const schoolId = formData.get("schoolId") as string;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return Response.json({ error: "Invalid file type" }, { status: 400 });
    }

    const school = await caller.school.get(schoolId);
    const ext = file.name.split(".").pop();

    const { key, fullPath } = await uploadFile({
      file: file,
      destination: `${school.id}.${ext}`,
      bucket: env.S3_IMAGE_BUCKET_NAME,
    });

    return Response.json({
      key,
      fullPath,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: (error as Error).message });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const { userId } = (await request.json()) as { userId: string };
    if (!userId) {
      return Response.json({ error: "No userId provided" }, { status: 400 });
    }
    const user = await caller.user.get(userId);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    const avatar = user.avatar;
    if (!avatar) {
      return Response.json({ error: "No avatar to delete" }, { status: 400 });
    }
    //const school = await caller.school.getSchool();

    const key = avatar.split(
      "https://discolaire-public.s3.eu-central-1.amazonaws.com/"
    )[1];
    //const key = `${school.code}/avatars/${userId}.png`;
    const command = new DeleteObjectCommand({
      Bucket: "discolaire-public",
      Key: key,
    });
    const response = await s3client.send(command);
    // Update the avatar in the database
    await caller.user.updateAvatar({
      id: userId,
      avatar: null,
    });
    return Response.json({ response });
  } catch (error) {
    return Response.json({ error: (error as Error).message });
  }
}
