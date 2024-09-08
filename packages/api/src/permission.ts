// https://github.com/supabase/shared-types/blob/master/src/constants.ts

import type { Permission } from "@repo/lib/permission";
import { auth } from "@repo/auth";
import { doPermissionsCheck } from "@repo/lib/permission";

import { userService } from "./services/user-service";

export async function checkPermissions(
  action: string,
  resource: string,
  data?: object,
  // Pass the data variables if you want to avoid hooks in this
  // e.g If you want to use useCheckPermissions in a loop like organization settings
  permissions?: Permission[],
) {
  const session = await auth();
  const user = session?.user;
  const permissionsOverride = permissions;
  if (!user) return false;

  const permissionsResult = await userService.getPermissions(user.id);

  const allPermissions = permissionsOverride ?? permissionsResult;

  return doPermissionsCheck(allPermissions, action, resource, data, "IPW");
}
