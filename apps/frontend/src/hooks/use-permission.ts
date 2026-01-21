import type { PermissionEntry, PermissionIndex } from "@repo/utils";
import { buildPermissionIndex, checkPermission } from "@repo/utils";

import { useSchool } from "~/providers/SchoolProvider";

const permissionIndexCache = new WeakMap<PermissionEntry[], PermissionIndex>();

const getPermissionIndex = (
  permissions: PermissionEntry[],
): PermissionIndex => {
  const cached = permissionIndexCache.get(permissions);
  if (cached) return cached;

  const index = buildPermissionIndex(permissions);
  permissionIndexCache.set(permissions, index);
  return index;
};

export const useCheckPermission = (
  resource: string,
  condition: Record<string, unknown> = {},
): boolean => {
  const { permissions } = useSchool();

  const permissionIndex = getPermissionIndex(permissions);
  return checkPermission(resource, condition, permissionIndex);
};
