import { useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import type { Permission } from "@repo/lib/permission";
import { doPermissionsCheck } from "@repo/lib/permission";

import { useUser } from "~/providers/AuthProvider";
import { api } from "~/trpc/react";

export const permissionAtom = atomWithStorage<Permission[]>("permissions", []);

const useIsLoggedIn = () => {
  const session = useUser();
  const user = session.user;
  return user !== null;
};

export function useGetPermissions(permissionsOverride?: Permission[]) {
  //const permissionsResult = api.user.permissions.useQuery();
  const permissionsResult = useAtomValue(permissionAtom);

  const permissions = permissionsOverride ?? permissionsResult;

  return {
    permissions,
  };
}

/**
 *
 * @param action ~/types/permissions PermissionAction
 * @param resource string *
 * @param data
 * @param permissions
 * TENANT_SQL_ADMIN_READ = "tenant:Sql:Admin:Read",
 * const canCreateTables = useCheckPermissions(PermissionAction.TENANT_SQL_ADMIN_WRITE, 'tables')
 * const canUpdate = useCheckPermissions(PermissionAction.UPDATE, 'custom_config_gotrue')
 */
export function useCheckPermissions(
  action: string,
  resource: string,
  data?: object,
  // Pass the data variables if you want to avoid hooks in this
  // e.g If you want to use useCheckPermissions in a loop like organization settings
  permissions?: Permission[],
) {
  const session = useUser();
  const user = session.user;
  //const isLoggedIn = useIsLoggedIn();

  const { permissions: allPermissions } = useGetPermissions(permissions);

  if (!user) return false;

  return doPermissionsCheck(
    allPermissions,
    action,
    resource,
    data,
    user.schoolId,
  );
}

export function usePermissionsLoaded() {
  const isLoggedIn = useIsLoggedIn();
  const permissionsQuery = api.user.permissions.useQuery();
  const setPermissionsAtom = useSetAtom(permissionAtom);
  if (!permissionsQuery.isPending) {
    setPermissionsAtom(permissionsQuery.data ?? []);
  }
  return isLoggedIn && permissionsQuery.isFetched;
}
