import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { LockKeyhole, Shield, User } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { getSession } from "~/auth/server";
import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { UserPermissionsPageClient } from "~/components/users/UserPermissionsPageClient";
import { ReinitializePassword } from "~/components/users/password/ReinitializePassword";
import { checkPermission } from "~/permissions/server";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";

import { UserProfile } from "./UserProfile";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await getSession();
  const { id } = params;
  const t = await getTranslations();

  const isStaff = session?.user.profile === "staff";
  const canReadPermission = isStaff && (await checkPermission("policy.read"));

  prefetch(trpc.user.get.queryOptions(id));

  if (canReadPermission) {
    prefetch(trpc.user.getPermissions.queryOptions(id));
    prefetch(trpc.module.all.queryOptions());
    prefetch(trpc.permission.all.queryOptions());
    prefetch(trpc.role.all.queryOptions());
  }

  return (
    <HydrateClient>
      <Tabs defaultValue="tab-1">
        <TabsList>
          <TabsTrigger value="tab-1">
            <User />
            {t("profile")}
          </TabsTrigger>
          <TabsTrigger value="tab-2">
            <LockKeyhole />
            {t("password")}
          </TabsTrigger>
          {canReadPermission && (
            <TabsTrigger value="tab-3">
              <Shield />
              {t("permissions")}
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent className="px-4" value="tab-1">
          <ErrorBoundary errorComponent={ErrorFallback}>
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
          </ErrorBoundary>
        </TabsContent>
        <TabsContent className="px-4" value="tab-2">
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense key={params.id} fallback={<Skeleton className="h-20" />}>
              <ReinitializePassword />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>
        {canReadPermission && (
          <TabsContent value="tab-3">
            <UserPermissionsPageClient userId={id} />
          </TabsContent>
        )}
      </Tabs>
    </HydrateClient>
  );
}