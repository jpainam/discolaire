//import jsonLogic from "json-logic-js";

import jsonLogic from "json-logic-js";
import { z } from "zod";

export enum PermissionAction {
  CREATE = "Create",
  READ = "Read",
  DELETE = "Delete",
  UPDATE = "Update",
}

export const permissionSchema = z.object({
  //actions: z.array(z.nativeEnum(PermissionAction)),
  actions: z.array(z.string()),
  resources: z.array(z.string()),
  schoolId: z.string(),
  effect: z.enum(["Allow", "Deny"]),
  condition: z.any(),
});

export const permissionsSchema = z.array(permissionSchema);

export interface Permission {
  actions: string[];
  //condition: jsonLogic.RulesLogic;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  condition?: any;
  schoolId: string;
  effect: "Allow" | "Deny";
  resources: string[];
}

const toRegexpString = (actionOrResource: string) =>
  `^${actionOrResource.replace(".", "\\.").replace("%", ".*")}$`;

export function doPermissionsCheck(
  permissions: Permission[] | undefined,
  action: string,
  resource: string,
  schoolId: string,
  data?: object,
) {
  if (!permissions || !Array.isArray(permissions)) {
    return false;
  }

  const allPermissions = permissions.filter(
    (permission) =>
      permission.schoolId === schoolId &&
      permission.actions.some((act) =>
        action ? action.match(toRegexpString(act)) : null,
      ) &&
      permission.resources.some((res) => resource.match(toRegexpString(res))),
  );
  // If there is at least one deny permission, return false
  const hasDenyPermission = allPermissions.some(
    (permission) => permission.effect === "Deny",
  );
  if (hasDenyPermission) {
    return false;
  }
  return allPermissions.some((per: Permission) => {
    if (!data || !per.condition) {
      return true;
    }

    const condition = per.condition as jsonLogic.RulesLogic;
    return jsonLogic.apply(condition, { resource_name: resource, ...data });
  });
}
