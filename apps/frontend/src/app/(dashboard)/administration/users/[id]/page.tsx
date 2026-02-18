import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { headers } from "next/headers";
import { getLocale } from "next-intl/server";

import { getAuth } from "~/auth/server";
import { ErrorFallback } from "~/components/error-fallback";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { getQueryClient, HydrateClient, trpc } from "~/trpc/server";
import { UserDetailClient } from "./UserDetailClient";
import { UserDetailRole } from "./UserDetailRole";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const userId = params.id;
  const queryClient = getQueryClient();
  const user = await queryClient.fetchQuery(trpc.user.get.queryOptions(userId));
  const auth = await getAuth();
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

  void queryClient.prefetchQuery(trpc.role.all.queryOptions());
  void queryClient.prefetchQuery(trpc.user.getPermissions.queryOptions(userId));
  void queryClient.prefetchQuery(trpc.module.all.queryOptions());

  return (
    <HydrateClient>
      <div className="grid grid-cols-1 items-start gap-4 p-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
            <CardDescription>{user.email}</CardDescription>
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
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<Skeleton className="h-20" />}>
            <UserDetailRole userId={userId} />
          </Suspense>
        </ErrorBoundary>
        <div className="col-span-full">
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
            <UserDetailClient userId={userId} />
          </Suspense>
        </div>
      </div>
    </HydrateClient>
  );
}
