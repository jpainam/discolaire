import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import { PermissionTable } from "./PermissionTable";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await api.user.get(params.id);
  if (!user) {
    notFound();
  }
  return (
    <div className="px-4">
      <div>List des permissions de l'utilisateur {user.name}</div>
      <PermissionTable user={user} />
    </div>
  );
}
