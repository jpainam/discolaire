/* eslint-disable @typescript-eslint/no-explicit-any */

import { auth } from "@repo/auth";
import redisClient from "@repo/kv";

import { getPermissions } from "./services/user-service";

export async function checkPermission(
  resource: string,
  action: "Read" | "Update" | "Delete" | "Create",
  condition: Record<string, any> = {},
) {
  const session = await auth();
  if (!session) return false;

  const key = `${session.user.id}:${resource}:${action}:${JSON.stringify(condition)}`;
  // TODO I need to update the cache when the permissions are assigned
  const _cached = await redisClient.get(key);
  //if (cached) {
  //  return cached === "true";
  //}

  const permissions = await getPermissions(session.user.id);

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
            await redisClient.set(key, "false");
            return false;
          }
        } else {
          await redisClient.set(key, "false");
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
  await redisClient.set(key, isAllowed ? "true" : "false");
  return isAllowed;
}
