import { randomUUID } from "crypto";
import { CreateEditHealthVisit } from "~/components/students/health/CreateEditHealthVisit";
import { caller } from "~/trpc/server";
import { getFullName } from "~/utils";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const student = await caller.student.get(params.id);

  let userId = student.userId;
  if (!userId) {
    const user = await caller.user.create({
      profile: "student",
      username: `${student.firstName?.toLowerCase()}.${student.lastName?.toLowerCase()}`,
      entityId: student.id,
      email: student.user?.email ?? "",
      password: randomUUID(),
    });
    userId = user.id;
  }

  return <CreateEditHealthVisit name={getFullName(student)} userId={userId} />;
}
