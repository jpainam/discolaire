"use server";

import { PermissionType } from "@repo/db";

import { menuPolicies, policies } from "~/configs/policies";
import { caller } from "~/trpc/server";

const defaultModules = [
  { name: "Configuration", code: "configuration" },
  { name: "Enrollment", code: "enrollment" },
  { name: "Contact", code: "contact" },
  { name: "Staff", code: "staff" },
  { name: "Finance", code: "finance" },
  { name: "Report", code: "report" },
  { name: "Student", code: "student" },
  { name: "Academy", code: "academy" },
  { name: "Administration", code: "administration" },
];

const resourceModuleMap: Record<string, string> = {
  classroom: "student",
  student: "student",
  staff: "staff",
  contact: "contact",
  subject: "academy",
  program: "academy",
  assignment: "academy",
  timetable: "academy",
  library: "academy",
  enrollment: "enrollment",
  fee: "finance",
  transaction: "finance",
  gradesheet: "report",
  attendance: "report",
  reportcard: "report",
  module: "configuration",
  policy: "configuration",
  subscription: "configuration",
  school: "configuration",
  user: "administration",
  inventory: "administration",
  communication: "administration",
  "menu:administration": "administration",
  "menu:staff": "staff",
  "menu:library": "academy",
};

function formatTitle(title: string) {
  return title.replaceAll("_", " ").trim();
}

export async function updatePermission() {
  const existingModules = await caller.module.all();
  const moduleIdByCode = new Map(
    existingModules.map((module) => [module.code.toLowerCase(), module.id]),
  );

  for (const mod of defaultModules) {
    const code = mod.code.toLowerCase();
    if (moduleIdByCode.has(code)) continue;
    const created = await caller.module.create({
      name: mod.name,
      code,
      description: `${mod.name} module`,
      isActive: true,
    });
    moduleIdByCode.set(code, created.id);
  }

  const existingPermissions = await caller.permission.all();
  const existingKeys = new Set(
    existingPermissions.map(
      (permission) =>
        `${permission.moduleId}:${permission.type}:${permission.resource}:${permission.name}`,
    ),
  );

  const actionPolicies = policies.map((policy) => ({
    ...policy,
    type: PermissionType.ACTION,
  }));
  const menuPolicyEntries = menuPolicies.map((policy) => ({
    ...policy,
    type: PermissionType.MENU,
  }));

  const plannedKeys = new Set(existingKeys);

  for (const policy of [...actionPolicies, ...menuPolicyEntries]) {
    const moduleCode = resourceModuleMap[policy.resource] ?? "administration";
    const moduleId = moduleIdByCode.get(moduleCode);
    if (!moduleId) continue;

    const baseTitle = formatTitle(policy.title);
    const actionLabel =
      policy.type === PermissionType.MENU
        ? "access"
        : policy.action.toLowerCase();
    const name = `${actionLabel} ${baseTitle}`.trim();
    const resourceName = `${policy.resource}.${policy.action.toLowerCase()}`;

    const key = `${moduleId}:${policy.type}:${resourceName}:${name}`;
    if (plannedKeys.has(key)) continue;

    await caller.permission.create({
      name,
      moduleId,
      type: policy.type,
      resource: resourceName,
      isActive: true,
    });
    plannedKeys.add(key);
  }
}
