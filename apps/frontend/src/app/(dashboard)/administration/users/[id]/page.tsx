import { api } from "~/trpc/server";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const user = await api.user.get(id);
  return <div>{JSON.stringify(user)}</div>;
}
