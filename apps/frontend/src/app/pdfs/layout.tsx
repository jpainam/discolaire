import type { PropsWithChildren } from "react";
import { redirect } from "next/navigation";

import { auth } from "@repo/auth";

export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }
  return <>{children}</>;
}
