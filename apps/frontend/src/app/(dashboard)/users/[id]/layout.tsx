import { auth } from "@repo/auth";
import { Separator } from "@repo/ui/components/separator";

import { NoPermission } from "~/components/no-permission";

import { checkPermission } from "@repo/api/permission";
import { Skeleton } from "@repo/ui/components/skeleton";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorFallback } from "~/components/error-fallback";
import { PermissionAction } from "~/permissions";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import { UserHeader } from "./UserHeader";

export default async function Layout(props: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const params = await props.params;
  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }
  if (session.user.id !== params.id) {
    if (session.user.profile == "staff") {
      const canReadUser = await checkPermission("user", PermissionAction.READ);
      if (!canReadUser) {
        return (
          <NoPermission className="my-8" isFullPage={true} resourceText="" />
        );
      }
    } else {
      return (
        <NoPermission className="my-8" isFullPage={true} resourceText="" />
      );
    }
  }

  const { children } = props;

  prefetch(trpc.user.get.queryOptions(params.id));

  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          key={params.id}
          fallback={
            <div className="px-4 py-2">
              <Skeleton className="h-20" />
            </div>
          }
        >
          <UserHeader />
        </Suspense>
      </ErrorBoundary>
      <Separator />

      {children}
    </HydrateClient>
  );
}
