/* eslint-disable @typescript-eslint/no-explicit-any */

export function checkPermission(
  resource: string,
  action: "read" | "update" | "delete" | "create",
  condition: Record<string, any> = {},
  permissions: {
    resource: string;
    action: "read" | "update" | "create" | "delete";
    effect: "allow" | "deny";
    condition?: Record<string, unknown> | null;
  }[],
) {
  let isAllowed = false;

  for (const perm of permissions) {
    if (perm.resource === resource && perm.action === action) {
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
