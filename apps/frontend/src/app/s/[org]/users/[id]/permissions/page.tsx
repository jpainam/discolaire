import { PermissionTable } from "~/components/users/PermissionTable";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return (
    <div className="p-4">
      <PermissionTable userId={params.id} />
    </div>
  );
}
