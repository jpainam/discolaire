import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

import { getSession } from "~/auth/server";
import { env } from "~/env";
import { CreateSchoolAction } from "./CreateSchoolAction";

export default async function Layout({ children }: PropsWithChildren) {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }
  const user = session.user;

  return (
    <div className="flex flex-col gap-2 px-4 py-2">
      <div className="ml-auto">
        {user.username == env.SUPER_ADMIN_USERNAME && <CreateSchoolAction />}
      </div>
      {children}
    </div>
  );
}
