"use client";

import { useQueryState } from "nuqs";

import { ScrollArea } from "@repo/ui/scroll-area";

import { AttachPolicyTable } from "./AttachPolicyTable";
import { CopyPermissionTable } from "./CopyPermissionTable";
import { UserGroupTable } from "./UserGroupTable";

export function PermissionTable() {
  const [type, _] = useQueryState("type", {
    defaultValue: "add_user_to_group",
  });

  return (
    <ScrollArea className="m-2 min-h-[calc(100vh-20rem)] rounded-md border">
      {type === "add_user_to_group" && <UserGroupTable />}
      {type === "copy_permissions" && <CopyPermissionTable />}
      {type === "attach_policy" && <AttachPolicyTable />}
    </ScrollArea>
  );
}
