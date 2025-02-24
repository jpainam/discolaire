// TO BE DELETED
//import jsonLogic from "json-logic-js";

import jsonLogic from "json-logic-js";
import { z } from "zod";

export enum PermissionAction {
  ANALYTICS_READ = "analytics:Read",
  AUTH_EXECUTE = "auth:Execute",
  BILLING_READ = "billing:Read",
  BILLING_WRITE = "billing:Write",
  FUNCTIONS_READ = "functions:Read",
  FUNCTIONS_WRITE = "functions:Write",
  INFRA_EXECUTE = "infra:Execute",
  SQL_SELECT = "sql:Read:Select",
  SQL_DELETE = "sql:Write:Delete",
  SQL_INSERT = "sql:Write:Insert",
  SQL_UPDATE = "sql:Write:Update",
  STORAGE_ADMIN_READ = "storage:Admin:Read",
  STORAGE_ADMIN_WRITE = "storage:Admin:Write",
  TENANT_SQL_ADMIN_READ = "tenant:Sql:Admin:Read",
  TENANT_SQL_ADMIN_WRITE = "tenant:Sql:Admin:Write",
  TENANT_SQL_CREATE_TABLE = "tenant:Sql:CreateTable",
  TENANT_SQL_DELETE = "tenant:Sql:Write:Delete",
  TENANT_SQL_INSERT = "tenant:Sql:Write:Insert",
  TENANT_SQL_QUERY = "tenant:Sql:Query",
  TENANT_SQL_SELECT = "tenant:Sql:Read:Select",
  TENANT_SQL_UPDATE = "tenant:Sql:Write:Update",

  CREATE = "write:Create",
  READ = "read:Read",
  DELETE = "write:Delete",
  UPDATE = "write:Update",
  // Staff
  STAFF_READ = "staff:Read",
  // Student
  STUDENT_READ = "student:Read",
  //
  CLASSROOM_READ = "classroom:Read",
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
