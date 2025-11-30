import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { LockKeyhole, Shield, User } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Skeleton } from "@repo/ui/components/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";

import { getSession } from "~/auth/server";
import { ErrorFallback } from "~/components/error-fallback";
import { ReinitializePassword } from "~/components/users/password/ReinitializePassword";
import { PermissionTable } from "~/components/users/PermissionTable";
import { PermissionAction } from "~/permissions";
import { checkPermission } from "~/permissions/server";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import { UserProfile } from "./UserProfile";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await getSession();
  const { id } = params;
  const t = await getTranslations();
  const canReadPermission = await checkPermission(
    "policy",
    PermissionAction.READ,
  );

  prefetch(trpc.user.get.queryOptions(id));

  return (
    <HydrateClient>
      <div className="w-full px-4">
        <Tabs defaultValue="tab-1">
          <TabsList className="text-foreground h-auto w-full items-start justify-start gap-2 rounded-none border-b bg-transparent px-0 py-1 text-left">
            <TabsTrigger
              value="tab-1"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <User />
              {t("profile")}
            </TabsTrigger>
            <TabsTrigger
              value="tab-2"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <LockKeyhole />
              {t("password")}
            </TabsTrigger>
            {session?.user.profile == "staff" && (
              <TabsTrigger
                value="tab-3"
                className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <Shield />
                {t("permissions")}
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent className="px-4" value="tab-1">
            <Suspense
              key={params.id}
              fallback={
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-8" />
                  ))}
                </div>
              }
            >
              <UserProfile />
            </Suspense>
          </TabsContent>
          <TabsContent className="px-4" value="tab-2">
            <ErrorBoundary errorComponent={ErrorFallback}>
              <Suspense
                key={params.id}
                fallback={<Skeleton className="h-20" />}
              >
                <ReinitializePassword />
              </Suspense>
            </ErrorBoundary>
          </TabsContent>
          {session?.user.profile == "staff" && (
            <TabsContent value="tab-3">
              {canReadPermission && <PermissionTable userId={params.id} />}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </HydrateClient>
  );
}
