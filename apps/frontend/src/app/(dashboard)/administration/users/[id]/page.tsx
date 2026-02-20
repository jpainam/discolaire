import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { headers } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";

import { getAuth } from "~/auth/server";
import { BreadcrumbsSetter } from "~/components/BreadcrumbsSetter";
import { ErrorFallback } from "~/components/error-fallback";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { EditUserButton } from "~/components/users/EditUserButton";
import { UserPermissionTable } from "~/components/users/UserPermissionTable";
import { UserRoleCard } from "~/components/users/UserRoleCard";
import { checkPermission } from "~/permissions/server";
import { getQueryClient, HydrateClient, trpc } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const userId = params.id;
  const queryClient = getQueryClient();
  const user = await queryClient.fetchQuery(trpc.user.get.queryOptions(userId));
  const auth = await getAuth();
  const canUpdateUser = await checkPermission("user.update");
  const { sessions } = await auth.api.listUserSessions({
    body: {
      userId,
    },
    headers: await headers(),
  });
  const lastSession = sessions.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )[0];
  const locale = await getLocale();
  const t = await getTranslations();

  const userPermissions = await queryClient.fetchQuery(
    trpc.user.getPermissions.queryOptions(userId),
  );

  const currentRoleIds = [
    ...new Set(
      userPermissions
        .flatMap((p) => p.sources)
        .filter((s) => s.type === "role")
        .map((s) => (s as { type: "role"; role: { id: string } }).role.id),
    ),
  ];

  void queryClient.prefetchQuery(trpc.role.all.queryOptions());
  void queryClient.prefetchQuery(trpc.user.getPermissions.queryOptions(userId));
  void queryClient.prefetchQuery(trpc.module.all.queryOptions());

  return (
    <HydrateClient>
      <div className="grid grid-cols-1 items-start gap-4 p-4">
        <BreadcrumbsSetter
          items={[
            { label: t("home"), href: "/" },
            { label: t("administration"), href: "/administration" },
            { label: t("users"), href: "/administration/users" },
            { label: user.name },
          ]}
        />
        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
            <CardDescription>{user.email}</CardDescription>
            <CardAction>
              {canUpdateUser && (
                <EditUserButton
                  userId={userId}
                  username={user.username}
                  email={user.email}
                  type={user.profile as "staff" | "contact" | "student"}
                />
              )}
            </CardAction>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Nom</dt>
              <dd>{user.name}</dd>
              <dt className="text-muted-foreground">Username</dt>
              <dd>{user.username}</dd>
            </dl>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Profil</dt>
              <dd>{user.profile}</dd>
              <dt className="text-muted-foreground">Statut</dt>
              <dd>{user.isActive ? "Actif" : "Inactif"}</dd>
            </dl>
          </CardContent>
          <CardFooter>
            <p className="text-muted-foreground text-xs">
              Dernière connexion:{" "}
              {lastSession?.updatedAt.toLocaleDateString(locale, {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </CardFooter>
        </Card>
        <Tabs defaultValue="roles" className="w-full">
          <TabsList>
            <TabsTrigger value="roles">{t("roles")}</TabsTrigger>
            <TabsTrigger value="permissions">{t("permissions")}</TabsTrigger>
          </TabsList>
          <TabsContent value="roles">
            <ErrorBoundary errorComponent={ErrorFallback}>
              <Suspense fallback={<Skeleton className="h-20" />}>
                <UserRoleCard userId={userId} currentRoleIds={currentRoleIds} />
              </Suspense>
            </ErrorBoundary>
          </TabsContent>
          <TabsContent value="permissions">
            <Suspense
              fallback={
                <Card>
                  <CardHeader>
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </CardContent>
                </Card>
              }
            >
              <UserPermissionTable userId={userId} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </HydrateClient>
  );
}
