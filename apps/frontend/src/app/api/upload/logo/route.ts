import { uploadFile } from "~/actions/upload";
import { getSession } from "~/auth/server";
import { env } from "~/env";
import { caller } from "~/trpc/server";

export async function POST(request: Request) {
  console.log("✅ POST /api/upload/logo");
  const session = await getSession();
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
      destination: `${school.code}/${school.id}.${ext}`,
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
