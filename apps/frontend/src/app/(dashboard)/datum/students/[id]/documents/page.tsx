import { api } from "~/trpc/server";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const documents = await api.student.documents(id);
  console.log(documents);
  return <div className="flex flex-col"></div>;
}
