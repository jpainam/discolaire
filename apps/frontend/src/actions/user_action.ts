"use server";

import { getSession } from "~/auth/server";
import { caller } from "~/trpc/server";

export async function getUserFromEntity({
  entityId,
  entityType,
}: {
  entityId: string;
  entityType: "staff" | "contact" | "student";
}) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return caller.user.getUserFromEntity({
    entityId,
    entityType,
  });
}
