"use client";

import { useQueryState } from "nuqs";

import { AttachPolicyTable } from "./AttachPolicyTable";
import { CopyPermissionTable } from "./CopyPermissionTable";

export function PermissionTable() {
  const [type, _] = useQueryState("type", {
    defaultValue: "add_user_to_group",
  });

  return (
    <>
      {type === "copy_permissions" && <CopyPermissionTable />}
      {type === "attach_policy" && <AttachPolicyTable />}
    </>
  );
}
