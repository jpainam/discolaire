import type { PropsWithChildren } from "react";

import { getSession } from "~/auth/server";
import { NoPermission } from "~/components/no-permission";

export default async function Layout({ children }: PropsWithChildren) {
  const session = await getSession();
  if (session?.user.profile !== "staff") {
    return <NoPermission className="my-8" isFullPage resourceText="" />;
  }
  return <>{children}</>;
}
