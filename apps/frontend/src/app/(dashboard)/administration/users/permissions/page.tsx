import { PermissionTable } from "~/components/users/PermissionTable";
import { PermissionHeader } from "./PermissionHeader";

export default async function Page(props: {
  searchParams: Promise<{ userId: string }>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex flex-col gap-2">
      <PermissionHeader />
      <div className="px-4">
        {searchParams.userId && (
          <PermissionTable userId={searchParams.userId} />
        )}
      </div>
    </div>
  );
}
