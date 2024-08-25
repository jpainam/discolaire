import { api } from "~/trpc/server";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const documents = await api.student.documents(id);
  return <div className="flex flex-col"></div>;
}
