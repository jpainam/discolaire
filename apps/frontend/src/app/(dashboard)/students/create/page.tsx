import { NoPermission } from "~/components/no-permission";
import { CreateStudent } from "~/components/students/profile/CreateStudent";
import { checkPermission } from "~/permissions/server";

export default async function Page() {
  const canCreateStudent = await checkPermission("student", "create");
  if (!canCreateStudent) {
    return <NoPermission className="my-8" />;
  }

  return <CreateStudent />;
}
