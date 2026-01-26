import path from "path";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import z from "zod/v4";

import { uploadFile } from "~/actions/upload";
import { parseSearchParams } from "~/app/api/utils";
import { getSession } from "~/auth/server";
import { env } from "~/env";
import { deleteFile } from "~/lib/s3-client";
import { caller, getQueryClient, trpc } from "~/trpc/server";

const postSchema = z.object({
  id: z.string(),
  profile: z.enum(["student", "contact", "staff"]),
});
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const postParams = parseSearchParams(request);
  const parsed = postSchema.safeParse(postParams);
  if (!parsed.success) {
    const error = z.treeifyError(parsed.error);
    return NextResponse.json(error, { status: 400 });
  }
  try {
    const { id: ownerId, profile } = parsed.data;
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }
    const originalFilename = file.name;
    const fileExtension = path.extname(originalFilename);
    if (!fileExtension) {
      return NextResponse.json(
        { error: "File has no extension." },
        { status: 400 },
      );
    }
    const uniqueFilename = `${ownerId}${fileExtension}`;
    const queryClient = getQueryClient();
    const school = await queryClient.fetchQuery(
      trpc.school.getSchool.queryOptions(),
    );

    const key = `${school.code}/${profile}/${uniqueFilename}`;
    const result = await uploadFile({
      file: file,
      bucket: env.S3_AVATAR_BUCKET_NAME,
      destination: key,
    });
    await caller.user.updateAvatar({
      id: ownerId,
      avatar: result.key,
      profile: profile,
    });

    // TODO Send an email to the user to confirm the change
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

const searchSchema = z.object({
  ownerId: z.string().optional(),
  filename: z.string().optional(),
  profile: z.enum(["student", "contact", "staff"]),
});
export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const searchParams = parseSearchParams(request);
    const parsed = searchSchema.safeParse(searchParams);
    if (!parsed.success) {
      const error = z.treeifyError(parsed.error);
      return NextResponse.json(error, { status: 400 });
    }
    const { ownerId, filename, profile } = parsed.data;
    const ids = [ownerId, filename].filter(Boolean);
    if (ids.length !== 1) {
      return NextResponse.json(
        {
          error: "Provide exactly one of key or id",
        },
        { status: 400 },
      );
    }
    const queryClient = getQueryClient();
    let avatar: string | null = null;
    let avatarOwnerId = ownerId;

    if (ownerId) {
      if (profile == "student") {
        const student = await queryClient.fetchQuery(
          trpc.student.get.queryOptions(ownerId),
        );
        avatar = student.avatar;
      } else if (profile == "staff") {
        const staff = await queryClient.fetchQuery(
          trpc.staff.get.queryOptions(ownerId),
        );
        avatar = staff.avatar;
      } else {
        const contact = await queryClient.fetchQuery(
          trpc.contact.get.queryOptions(ownerId),
        );
        avatar = contact.avatar;
      }
    } else if (filename) {
      const { id: fromKeyOwner } = await queryClient.fetchQuery(
        trpc.photo.getFromKey.queryOptions({ key: filename, profile }),
      );
      avatarOwnerId = fromKeyOwner;
      avatar = filename;
    }
    if (avatarOwnerId) await deleteFromProfile(avatar, avatarOwnerId, profile);

    return Response.json({ message: "Avatar deleted successfully" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

async function deleteFromProfile(
  key: string | null,
  id: string,
  profile: "student" | "contact" | "staff",
) {
  if (!key) return;
  await deleteFile({
    bucket: env.S3_AVATAR_BUCKET_NAME,
    key,
  });
  return caller.user.updateAvatar({
    id: id,
    profile: profile,
    avatar: null,
  });
}
