import type { PermissionIndex } from "@repo/utils";
import {
  buildPermissionIndex,
  checkPermission as checkPermissionBase,
} from "@repo/utils";

import { getSession } from "~/auth/server";
import { caller } from "~/trpc/server";

const permissionIndexCache = new Map<string, PermissionIndex>();

export const clearPermissionIndexCache = (userId?: string) => {
  if (userId) {
    permissionIndexCache.delete(userId);
    return;
  }
  permissionIndexCache.clear();
};

export async function checkPermission(
  resource: string,
  condition: Record<string, unknown> = {},
) {
  const session = await getSession();
  if (!session) return false;
  const userId = session.user.id;

  let permissionIndex = permissionIndexCache.get(userId);
  if (!permissionIndex) {
    const permissions = await caller.user.getPermissions(userId);
    permissionIndex = buildPermissionIndex(permissions);
    permissionIndexCache.set(userId, permissionIndex);
  }

  return checkPermissionBase(resource, condition, permissionIndex);
}
