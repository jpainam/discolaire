import type { PropsWithChildren } from "react";

import { auth } from "@repo/auth";
import { NoPermission } from "~/components/no-permission";

export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth();
  if (session?.user.profile !== "staff") {
    return <NoPermission className="my-8" isFullPage resourceText="" />;
  }
  return <>{children}</>;
}
