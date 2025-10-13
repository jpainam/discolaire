import type React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { studentService } from "@repo/api/services";

import { getSession } from "~/auth/server";
import { ClassroomHeader } from "~/components/classrooms/ClassroomHeader";
import { NoPermission } from "~/components/no-permission";
import { PermissionAction } from "~/permissions";
import { checkPermission } from "~/permissions/server";
import { caller } from "~/trpc/server";

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { children } = props;
  const params = await props.params;

  let canReadClassroom = false;
  const session = await getSession();
  const classroom = await caller.classroom.get(params.id);
  const schoolYearId = (await cookies()).get("x-school-year")?.value;
  if (!session || !schoolYearId || schoolYearId !== classroom.schoolYearId) {
    redirect("/");
  }
  const { user } = session;

  if (user.profile === "student") {
    const student = await studentService.getFromUserId(user.id);
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
    canReadClassroom = await checkPermission(
      "classroom",
      PermissionAction.READ,
    );

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
    return <NoPermission className="my-8" isFullPage={true} resourceText="" />;
  }
  return (
    <div className="grid grid-cols-1">
      <ClassroomHeader />
      {children}
    </div>
  );
}
