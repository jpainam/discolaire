import { randomUUID } from "crypto";

import { uploadFiles } from "~/actions/upload";
import { getSession } from "~/auth/server";
import { env } from "~/env";
import { getQueryClient, trpc } from "~/trpc/server";

function sanitizeBaseName(filename: string) {
  const withoutExtension = filename.includes(".")
    ? filename.slice(0, filename.lastIndexOf("."))
    : filename;

  const sanitized = withoutExtension
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return sanitized || "attachment";
}

function getFileExtension(file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext && /^[a-z0-9]+$/.test(ext)) {
    return ext;
  }

  switch (file.type) {
    case "application/pdf":
      return "pdf";
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return "docx";
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "bin";
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[] | null;
    const classroomId = formData.get("classroomId") as string | null;

    if (!classroomId) {
      return Response.json({ error: "classroomId missing" }, { status: 400 });
    }

    if (!files || files.length === 0) {
      return Response.json({ error: "Files missing" }, { status: 400 });
    }

    if (
      !Array.isArray(files) ||
      files.some((file) => !(file instanceof File))
    ) {
      return Response.json({ error: "Invalid file type" }, { status: 400 });
    }

    const queryClient = getQueryClient();
    const school = await queryClient.fetchQuery(
      trpc.school.getSchool.queryOptions(),
    );

    const destinations = files.map((file, index) => {
      const safeName = sanitizeBaseName(file.name) || `attachment-${index + 1}`;
      const extension = getFileExtension(file);
      return `${school.code}/assignments/${classroomId}/${randomUUID()}-${safeName}.${extension}`;
    });

    const results = await uploadFiles({
      files,
      bucket: env.S3_DOCUMENT_BUCKET_NAME,
      destinations,
    });

    return Response.json(results);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
