import { auth } from "@repo/auth";
import { PermissionTable } from "~/components/users/PermissionTable";
import { PermissionHeader } from "./PermissionHeader";

export default async function Page(props: {
  searchParams: Promise<{ userId?: string }>;
}) {
  const session = await auth();
  const searchParams = await props.searchParams;
  const userId = searchParams.userId ?? session?.user.id;
  return (
    <div className="flex flex-col gap-2">
      {userId && <PermissionHeader defaultValue={userId} />}

      <div className="px-4">
        {userId && <PermissionTable userId={userId} />}
      </div>
    </div>
  );
}
