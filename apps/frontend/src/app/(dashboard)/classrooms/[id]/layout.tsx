import React from "react";

import { checkPermission } from "@repo/api/permission";
import { auth } from "@repo/auth";
import { NoPermission } from "~/components/no-permission";
import { PermissionAction } from "~/permissions";
import { api } from "~/trpc/server";

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { children } = props;
  const params = await props.params;

  let canReadClassroom = false;
  const session = await auth();
  if (session?.user.profile === "student") {
    const student = await api.student.getFromUserId(session.user.id);
    const classroom = await api.student.classroom({ studentId: student.id });
    if (classroom?.id === params.id) {
      canReadClassroom = true;
    }
  } else {
    canReadClassroom = await checkPermission(
      "classroom",
      PermissionAction.READ
    );
  }

  if (!canReadClassroom) {
    return <NoPermission className="my-8" isFullPage={true} resourceText="" />;
  }
  return <>{children}</>;
}
