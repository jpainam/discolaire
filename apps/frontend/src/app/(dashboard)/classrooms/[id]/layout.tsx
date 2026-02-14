import type React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getSession } from "~/auth/server";
import { BreadcrumbsSetter } from "~/components/BreadcrumbsSetter";
import { ClassroomHeader } from "~/components/classrooms/ClassroomHeader";
import { NoPermission } from "~/components/no-permission";
import { RightPanelSetter } from "~/components/RightPanelSetter";
import { checkPermission } from "~/permissions/server";
import { caller, getQueryClient, trpc } from "~/trpc/server";
import { ClassroomRightPanelMeta } from "./ClassroomRightPanelMeta";

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { children } = props;
  const params = await props.params;
  const queryClient = getQueryClient();

  let canReadClassroom = false;
  const session = await getSession();
  const schoolYearId = (await cookies()).get("x-school-year")?.value;
  if (!session || !schoolYearId) {
    redirect("/auth/login");
  }

  const classroom = await caller.classroom.get(params.id);

  if (schoolYearId !== classroom.schoolYearId) {
    redirect("/");
  }
  const { user } = session;

  if (user.profile === "student") {
    const student = await queryClient.fetchQuery(
      trpc.student.getFromUserId.queryOptions(user.id),
    );
    const classroom = await caller.student.classroom({
      studentId: student.id,
      schoolYearId,
    });

    if (classroom?.id === params.id) {
      canReadClassroom = true;
    }
  } else if (user.profile === "contact") {
    const contact = await caller.contact.getFromUserId(session.user.id);
    const classrooms = await caller.contact.classrooms(contact.id);
    const classroomIds = classrooms.map((c) => c.id);
    canReadClassroom = classroomIds.includes(params.id);
  } else {
    canReadClassroom = await checkPermission("classroom.read");

    if (!canReadClassroom) {
      const staff = await caller.staff.getFromUserId(user.id);
      const classrooms = await caller.staff.classrooms({
        staffId: staff.id,
        schoolYearId,
      });
      const classroomIds = classrooms.map((c) => c.id);
      canReadClassroom = classroomIds.includes(params.id);
    }
  }

  if (!canReadClassroom) {
    return <NoPermission />;
  }
  return (
    <div className="grid grid-cols-1">
      <BreadcrumbsSetter
        items={[
          { label: "home", href: "/" },
          { label: "classrooms", href: "/classrooms" },
          { label: classroom.name },
        ]}
      />
      <RightPanelSetter
        content={<ClassroomRightPanelMeta classroomId={classroom.id} />}
      />
      <ClassroomHeader />

      {children}
    </div>
  );
}
