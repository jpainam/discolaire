import type { PropsWithChildren } from "react";
import { redirect } from "next/navigation";

import { getSession } from "~/auth/server";
import { NoPermission } from "~/components/no-permission";
import { caller } from "~/trpc/server";

export default async function Layout({
  children,
  params,
}: PropsWithChildren<{ params: Promise<{ id: string }> }>) {
  const session = await getSession();
  const { id } = await params;
  if (!session) {
    redirect("/auth/login");
  }
  const contact = await caller.contact.get(id);
  if (session.user.profile == "contact" && session.user.id != contact.userId) {
    return <NoPermission className="my-8" />;
  }
  if (session.user.profile == "student") {
    const studentContacts = await caller.contact.students(id);
    const userIds = studentContacts
      .map((stdc) => stdc.student.userId)
      .filter((userId) => userId != null);
    if (!userIds.includes(session.user.id)) {
      return <NoPermission className="my-8" />;
    }
  } else {
    // const canReadContact = await checkPermission(
    //   "contact",
    //   PermissionAction.READ,
    // );
    // if (!canReadContact) {
    //   return <NoPermission className="my-8" />;
    // }
  }
  return <>{children}</>;
}
