import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";
import { getSession } from "~/auth/server";
import { NoPermission } from "~/components/no-permission";
import { PermissionAction } from "~/permissions";
import { checkPermission } from "~/permissions/server";
import { caller } from "~/trpc/server";
import { PrintAction } from "./PrintAction";
import { TransactionTabMenu } from "./TransactionTabMenu";

export default async function Layout(
  props: PropsWithChildren<{ params: Promise<{ id: string }> }>
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
    canReadTransaction = await checkPermission(
      "transaction",
      PermissionAction.READ
    );
  }

  if (!canReadTransaction) {
    return <NoPermission className="my-8" />;
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between border-b py-1 px-4">
        <TransactionTabMenu />
        <PrintAction />
      </div>
      {props.children}
    </div>
  );
}
