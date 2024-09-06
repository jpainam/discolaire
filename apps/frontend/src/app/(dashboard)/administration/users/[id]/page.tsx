import { notFound } from "next/navigation";

import { api } from "~/trpc/server";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const user = await api.user.get(id);
  if (!user) {
    notFound();
  }
  return <div>{JSON.stringify(user)}</div>;
}
