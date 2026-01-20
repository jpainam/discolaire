import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { getTranslations } from "next-intl/server";

import { ErrorFallback } from "~/components/error-fallback";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Skeleton } from "~/components/ui/skeleton";
import { getQueryClient, HydrateClient, trpc } from "~/trpc/server";
import { UserRoleDetailHeader } from "./UserRoleDetailHeader";
import { UserRolePermissionList } from "./UserRolePermissionList";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const roleId = params.id;
  const queryClient = getQueryClient();
  const role = await queryClient.fetchQuery(
    trpc.userRole.get.queryOptions(roleId),
  );
  const t = await getTranslations();
  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense>
          <UserRoleDetailHeader roleId={params.id} />
        </Suspense>
      </ErrorBoundary>
      <div className="lg: grid grid-cols-1 gap-4 lg:grid-cols-3 px-4">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-3">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
            }
          >
            <Card>
              <CardHeader>
                <CardTitle>{role.name}</CardTitle>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Label>{t("name")}</Label>
                <div>{role.name}</div>
                <Label>{t("Label")}</Label>
                <Badge variant={"secondary"} className="text-cyan">
                  {role.level}
                </Badge>
                <Label>{t("Permissions")}</Label>
                <Badge variant={"outline"} className="bg-purple rounded-full">
                  {role._count.permissionRoles}
                </Badge>
                <Label>{t("Users")}</Label>
                <Badge variant={"default"} className="rounded-full">
                  {role._count.users}
                </Badge>
              </CardContent>
            </Card>
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 grid-cols-2 gap-3">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
            }
          >
            <UserRolePermissionList className="col-span-2" roleId={params.id} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
