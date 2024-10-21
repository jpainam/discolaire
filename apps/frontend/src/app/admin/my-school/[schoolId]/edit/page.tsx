import { notFound } from "next/navigation";

import { api } from "~/trpc/server";
import Edit from "./Edit";

export default async function Page({
  params: { schoolId },
}: {
  params: { schoolId: string };
}) {
  const school = await api.school.get(schoolId);
  if (!school) {
    notFound();
  }
  return <Edit school={school} />;
}
