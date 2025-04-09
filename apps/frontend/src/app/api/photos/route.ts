import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
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
    const matchedIdsRaw = formData.get("matchedIds");
    const school = await caller.school.getSchool();
    const schoolCode = school.code;

    if (!matchedIdsRaw || typeof matchedIdsRaw !== "string") {
      return Response.json({ error: "Missing matchedIds" }, { status: 400 });
    }

    const matchedIds: string[] = JSON.parse(matchedIdsRaw) as string[];

    const tasks = matchedIds.map((id) => async () => {
      const fieldName = `id_${id}`;
      const file = formData.get(fieldName);

      if (!file || !(file instanceof File)) {
        console.warn(`File missing or invalid for ${fieldName}`);
        return null;
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = file.name.split(".").pop();
      const key = `${schoolCode}/avatars/${id}.${ext}`;

      const command = new PutObjectCommand({
        Bucket: "discolaire-public",
        Key: key,
        Body: buffer,
        ContentType: file.type,
      });

      await s3client.send(command);
      return { id, key };
    });

    const uploadResults = await runWithConcurrency(tasks, 5); // limit to 5 parallel uploads

    return Response.json({
      success: true,
      uploaded: uploadResults.filter(Boolean), // remove nulls if any
    });
  } catch (error) {
    console.error("Upload failed:", error);
    return Response.json({ error: "Upload failed" }, { status: 500 });
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
      "https://discolaire-public.s3.eu-central-1.amazonaws.com/",
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

async function runWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  concurrency: number,
): Promise<T[]> {
  const results: T[] = [];
  const queue = [...tasks];

  async function worker() {
    while (queue.length > 0) {
      const task = queue.shift();
      if (!task) return;
      try {
        const result = await task();
        results.push(result);
      } catch (e) {
        console.error("Task failed:", e);
        // You can push an error or null here if you want to preserve order
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);
  return results;
}
