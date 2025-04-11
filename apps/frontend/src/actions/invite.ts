"use server";

import { db } from "@repo/db";
import { nanoid } from "nanoid";
import { caller } from "~/trpc/server";

// eslint-disable-next-line @typescript-eslint/require-await
export async function generateInviteToken() {
  return nanoid(8); // Generates an 8-character token
}
export async function createUniqueInvite({
  entityId,
  entityType,
}: {
  entityId: string;
  entityType: string;
}) {
  let token;
  let exists = true;

  while (exists) {
    token = await generateInviteToken();
    const existing = await db.invite.findUnique({ where: { token } });
    exists = !!existing;
  }

  const school = await caller.school.getSchool();
  if (!token) {
    throw new Error("Token not generated");
  }
  await db.invite.create({
    data: {
      token,
      entityId,
      entityType,
      schoolId: school.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    }, // Expires in 24 hours
  });

  return token;
}
