import type { PropsWithChildren } from "react";
import { redirect } from "next/navigation";

import { getSession } from "~/auth/server";
import { NoPermission } from "~/components/no-permission";
import { checkPermission } from "~/permissions/server";
import { caller } from "~/trpc/server";

export default async function Layout(
  props: PropsWithChildren<{ params: Promise<{ id: string }> }>,
) {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }
  const { user } = session;
  const params = await props.params;

  const student = await caller.student.get(params.id);
  let canReadTransaction = false;
  if (user.profile == "student") {
    canReadTransaction = student.userId == user.id;
  } else if (user.profile == "contact") {
    const contact = await caller.contact.getFromUserId(user.id);
    const students = await caller.contact.students(contact.id);
    const studentIds = students.map((s) => s.studentId);
    canReadTransaction = studentIds.includes(params.id);
  } else {
    canReadTransaction = await checkPermission("transaction", "read");
  }

  if (!canReadTransaction) {
    return <NoPermission className="my-8" />;
  }

  return <>{props.children}</>;
}
