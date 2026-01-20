/* eslint-disable @typescript-eslint/no-explicit-any */

import { getSession } from "~/auth/server";
import { caller } from "~/trpc/server";

export async function checkPermission(
  resource: string,
  condition: Record<string, any> = {},
) {
  const session = await getSession();
  if (!session) return false;
  const userId = session.user.id;

  const permissions = await caller.user.getPermissions(userId);
  let isAllowed = false;

  for (const perm of permissions) {
    if (perm.resource === resource) {
      if (perm.effect === "deny") {
        if (perm.condition) {
          // If deny condition matches, return false
          const conditionMatches = Object.entries(perm.condition).every(
            ([key, value]) => condition[key] === value,
          );
          if (conditionMatches) {
            return false;
          }
        } else {
          return false; // Deny without condition overrides allow
        }
      }

      if (perm.effect === "allow") {
        if (perm.condition) {
          const conditionMatches = Object.entries(perm.condition).every(
            ([key, value]) => condition[key] === value,
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
