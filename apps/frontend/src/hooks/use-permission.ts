/* eslint-disable @typescript-eslint/no-explicit-any */

import { useSchool } from "~/providers/SchoolProvider";

const cache = new Map<string, boolean>();

export const useCheckPermission = (
  resource: string,
  action: "Read" | "Update" | "Delete" | "Create",
  condition: Record<string, any> = {},
): boolean => {
  const { permissions } = useSchool();
  const key = `${resource}-${action}-${JSON.stringify(condition)}`;
  if (cache.has(key)) {
    // TODO I need to update the cache when the permissions are assigned
    //return cache.get(key)!;
  }

  let isAllowed = false;

  for (const perm of permissions) {
    if (perm.resource === resource && perm.action === action) {
      if (perm.effect === "Deny") {
        if (perm.condition) {
          // If deny condition matches, return false

          const conditionMatches = Object.entries(perm.condition).every(
            ([key, value]) => condition[key] === value,
          );
          if (conditionMatches) {
            cache.set(key, false);
            return false;
          }
        } else {
          cache.set(key, false);
          return false; // Deny without condition overrides allow
        }
      }

      if (perm.effect === "Allow") {
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
  cache.set(key, isAllowed);
  return isAllowed;
};
