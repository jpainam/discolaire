import type { PropsWithChildren } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@repo/auth";

export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }
  const user = session.user;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center gap-4">
        <Link href={"/administration/users/roles"}>Roles</Link>
        <Link href={`/administration/users/${user.id}`}>Users</Link>
        <Link href={`/administration/users/policies`}>Policies</Link>
      </div>
      {children}
    </div>
  );
}
