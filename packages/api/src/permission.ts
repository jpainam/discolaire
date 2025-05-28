/* eslint-disable @typescript-eslint/no-explicit-any */

import { auth } from "@repo/auth";
import redisClient from "@repo/kv";

import type { Permission } from ".";
import { getPermissions } from "./services/user-service";

// TODO Move this function into frontend, it's not use in packages/api
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

// Function used in the packages/api, remove the first one when the frontend is ready
// use internla Map cache later
export function checkPermission2(
  resource: string,
  action: "Read" | "Update" | "Delete" | "Create",
  condition: Record<string, any> = {},
  permissions: Permission[],
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
