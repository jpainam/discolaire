import { PermissionTable } from "~/components/administration/users/PermissionTable";
import { UserAddPermissionHeader } from "~/components/administration/users/UserAddPermissionHeader";

export default function Page() {
  return (
    <div className="flex flex-col gap-2">
      <UserAddPermissionHeader />
      <PermissionTable />
    </div>
  );
}
