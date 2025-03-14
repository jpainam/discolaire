/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import type { Permission } from "~/permissions";
import { doPermissionsCheck } from "~/permissions";

import { useSession } from "~/providers/AuthProvider";
import { useSchool } from "~/providers/SchoolProvider";
import { api } from "~/trpc/react";

// const useIsLoggedIn = () => {
//   const session = useSession();
//   const user = session.data?.user;
//   return user !== undefined;
// };

export function useGetPermissions(permissionsOverride?: Permission[]) {
  //const permissionsResult = api.user.permissions.useQuery();
  // Assuming permissionAtom is loaded the Header.tsx file
  const { permissions: permissionsResult } = useSchool();

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
  permissions?: Permission[]
) {
  const session = useSession();
  const user = session.user;
  //const isLoggedIn = useIsLoggedIn();

  const { permissions: permissionsResult } = useSchool();

  const allPermissions = permissions ?? permissionsResult;

  //const { permissions: allPermissions } = useGetPermissions(permissions);

  if (!user) return false;

  return doPermissionsCheck(
    allPermissions,
    action,
    resource,
    user.schoolId,
    data
  );
}

// export function usePermissionsLoaded() {
//   const isLoggedIn = useIsLoggedIn();
//   const permissionsQuery = api.user.permissions.useQuery();
//   const setPermissionsAtom = useSetAtom(permissionAtom);
//   if (!permissionsQuery.isPending) {
//     setPermissionsAtom(permissionsQuery.data ?? []);
//   }
//   return isLoggedIn && permissionsQuery.isFetched;
// }

export interface Permission2 {
  resource: "classroom" | "staff" | "student";
  action: "Read" | "Update" | "Delete" | "Create";
  effect: "Deny" | "Allow";

  condition?: Record<string, any>;
}

export const useCheckPermission2 = (
  userId: string,
  resource: "classroom" | "staff" | "student",
  action: "Read" | "Update" | "Delete" | "Create",
  condition: Record<string, any> = {}
): boolean => {
  const { user } = useSession();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const permissionQuery = api.user.getPermissions.useQuery();

  useEffect(() => {
    if (permissionQuery.isLoading) {
      setHasPermission(null);
    } else if (permissionQuery.isError) {
      setHasPermission(false);
    } else {
      const val = doCheckPermission2(
        permissionQuery.data ?? [],
        resource,
        action,
        condition
      );
      setHasPermission(val);
    }
  }, [permissionQuery.data, permissionQuery.isLoading]);

  return { hasPermission, isLoading: status === "loading" || isLoading };
};

function doCheckPermission2(
  permissions: Permission2[],
  resource: string,
  action: string,
  condition: Record<string, any> = {}
) {
  let isAllowed = false;

  for (const perm of permissions) {
    if (perm.resource === resource && perm.action === action) {
      if (perm.effect === "Deny") {
        if (perm.condition) {
          // If deny condition matches, return false
          const conditionMatches = Object.entries(perm.condition).every(
            ([key, value]) => condition[key] === value
          );
          if (conditionMatches) return false;
        } else {
          return false; // Deny without condition overrides allow
        }
      }

      if (perm.effect === "Allow") {
        if (perm.condition) {
          const conditionMatches = Object.entries(perm.condition).every(
            ([key, value]) => condition[key] === value
          );
          if (conditionMatches) isAllowed = true;
        } else {
          isAllowed = true;
        }
      }
    }
  }

  return isAllowed;
}
