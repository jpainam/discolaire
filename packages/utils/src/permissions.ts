export interface PermissionEntry {
  resource: string;
  effect: "allow" | "deny";
  condition?: Record<string, unknown> | null;
}

export type PermissionIndex = Map<
  string,
  {
    allow: (Record<string, unknown> | null | undefined)[];
    deny: (Record<string, unknown> | null | undefined)[];
  }
>;

const conditionsMatch = (
  requested: Record<string, unknown>,
  permissionCondition: Record<string, unknown> | null | undefined,
): boolean => {
  if (!permissionCondition) return true;

  const requestedKeys = Object.keys(requested);
  const permissionKeys = Object.keys(permissionCondition);

  if (requestedKeys.length !== permissionKeys.length) return false;

  for (const key of permissionKeys) {
    if (!Object.prototype.hasOwnProperty.call(requested, key)) return false;
    if (!Object.is(requested[key], permissionCondition[key])) return false;
  }

  return true;
};

export function checkPermission(
  resource: string,
  condition: Record<string, unknown> = {},
  permissionIndex: PermissionIndex,
): boolean {
  const entry = permissionIndex.get(resource);
  if (!entry) return false;

  for (const denyCondition of entry.deny) {
    if (conditionsMatch(condition, denyCondition)) {
      return false;
    }
  }

  for (const allowCondition of entry.allow) {
    if (conditionsMatch(condition, allowCondition)) {
      return true;
    }
  }

  return false;
}

export function buildPermissionIndex(
  permissions: PermissionEntry[],
): PermissionIndex {
  const index: PermissionIndex = new Map();

  for (const perm of permissions) {
    const entry = index.get(perm.resource) ?? { allow: [], deny: [] };

    if (perm.effect === "allow") {
      entry.allow.push(perm.condition);
    } else {
      entry.deny.push(perm.condition);
    }

    index.set(perm.resource, entry);
  }

  return index;
}
