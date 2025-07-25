/* eslint-disable @typescript-eslint/no-explicit-any */

export function checkPermission(
  resource: string,
  action: "Read" | "Update" | "Delete" | "Create",
  condition: Record<string, any> = {},
  permissions: {
    resource: string;
    action: "Read" | "Update" | "Create" | "Delete";
    effect: "Allow" | "Deny";
    condition?: Record<string, unknown> | null;
  }[],
) {
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
            return false;
          }
        } else {
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
  return isAllowed;
}
