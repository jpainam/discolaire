import Link from "next/link";
import { notFound } from "next/navigation";

import { api } from "~/trpc/server";

export default async function Page(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;

  const {
    id
  } = params;

  const user = await api.user.get(id);
  if (!user) {
    notFound();
  }
  return (
    <div className="flex flex-col gap-8">
      {JSON.stringify(user)}

      <div>
        <Link href={`/administration/users/${id}/add-permissions`}>
          Add Permission
        </Link>
      </div>
    </div>
  );
}
