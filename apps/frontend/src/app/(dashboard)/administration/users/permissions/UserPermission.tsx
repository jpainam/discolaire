"use client";

import { PermissionHeader } from "./PermissionHeader";

export function UserPermission() {
  //const [userId] = useQueryState("userId");
  return (
    <div className="flex flex-col gap-2">
      <PermissionHeader />
      <div className="px-4">
        {/* {userId && <PermissionTable userId={userId} />} */}
      </div>
    </div>
  );
}
