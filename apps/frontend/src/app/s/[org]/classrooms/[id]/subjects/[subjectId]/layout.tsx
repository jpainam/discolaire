import type { PropsWithChildren } from "react";
import { redirect } from "next/navigation";

import { caller } from "~/trpc/server";

export default async function Layout(
  props: PropsWithChildren<{
    params: Promise<{ id: string; subjectId: string }>;
  }>,
) {
  const params = await props.params;
  const subject = await caller.subject.get(Number(params.subjectId));
  if (subject.classroomId !== params.id) {
    redirect(`/classrooms/${params.id}`);
  }
  return <>{props.children}</>;
}
