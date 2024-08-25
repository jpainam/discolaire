// /* eslint-disable @typescript-eslint/no-unsafe-call */
// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// import jsonLogic from "json-logic-js";
// import { useSession } from "next-auth/react";
// import { Permission } from "~/types/permission";
// const toRegexpString = (actionOrResource: string) =>
//   `^${actionOrResource.replace(".", "\\.").replace("%", ".*")}$`;
// export function doPermissionsCheck(
//   permissions: Permission[] | undefined,
//   action: string,
//   resource: string,
//   data?: object,
//   schoolId?: string,
// ) {
//   if (!permissions || !Array.isArray(permissions)) {
//     return false;
//   }
//   const allPermissions = permissions.filter(
//     (permission) =>
//       permission.schoolId === schoolId &&
//       permission.actions.some((act: never) =>
//         action ? action.match(toRegexpString(act)) : null,
//       ) &&
//       permission.resources.some((res: never) =>
//         resource.match(toRegexpString(res)),
//       ),
//   );
//   // If there is at least one deny permission, return false
//   const hasDenyPermission = allPermissions.some(
//     (permission) => permission.effect === "Deny",
//   );
//   if (hasDenyPermission) {
//     return false;
//   }
//   return allPermissions.some((per: Permission) => {
//     if (per.condition == null || per.condition == undefined) {
//       return true;
//     }
//     const condition = per.condition as jsonLogic.RulesLogic;
//     return jsonLogic.apply(condition, { resource_name: resource, ...data });
//   });
// }
// const useIsLoggedIn = () => {
//   const session = useSession();
//   const user = session.data?.user;
//   return user !== null;
// };
// export function useGetPermissions(permissionsOverride?: Permission[]) {
//   const permissionsResult = api.user.permissions.useQuery();
//   const permissions =
//     permissionsOverride === undefined
//       ? permissionsResult.data
//       : permissionsOverride;
//   return {
//     permissions,
//   };
// }
// /**
//  *
//  * @param action ~/types/permissions PermissionAction
//  * @param resource string *
//  * @param data
//  * @param permissions
//  * TENANT_SQL_ADMIN_READ = "tenant:Sql:Admin:Read",
//  * const canCreateTables = useCheckPermissions(PermissionAction.TENANT_SQL_ADMIN_WRITE, 'tables')
//  * const canUpdate = useCheckPermissions(PermissionAction.UPDATE, 'custom_config_gotrue')
//  */
// export function useCheckPermissions(
//   action: string,
//   resource: string,
//   data?: object,
//   // Pass the data variables if you want to avoid hooks in this
//   // e.g If you want to use useCheckPermissions in a loop like organization settings
//   permissions?: Permission[],
// ) {
//   const isLoggedIn = useIsLoggedIn();
//   const { permissions: allPermissions } = useGetPermissions(permissions);
//   if (!isLoggedIn) return false;
//   return doPermissionsCheck(
//     allPermissions as Permission[],
//     action,
//     resource,
//     data,
//   );
// }
// export function usePermissionsLoaded() {
//   const isLoggedIn = useIsLoggedIn();
//   const { isFetched: isPermissionsFetched } = api.user.permissions.useQuery();
//   return isLoggedIn && isPermissionsFetched;
// }
