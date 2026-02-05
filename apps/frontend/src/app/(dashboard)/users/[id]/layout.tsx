import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getSession } from "~/auth/server";
import { BreadcrumbsSetter } from "~/components/BreadcrumbsSetter";
import { NoPermission } from "~/components/no-permission";
import { checkPermission } from "~/permissions/server";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";

export default async function Layout(props: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const params = await props.params;
  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }
  const user = session.user;
  if (user.id !== params.id) {
    if (session.user.profile == "staff") {
      const canReadUser = await checkPermission("user.read");
      if (!canReadUser) {
        return <NoPermission />;
      }
    } else {
      return <NoPermission />;
    }
  }

  const { children } = props;

  prefetch(trpc.user.get.queryOptions(params.id));
  const t = await getTranslations();

  return (
    <HydrateClient>
      <BreadcrumbsSetter
        items={[
          { label: t("home"), href: "/" },
          { label: t("users"), href: "/users" },
          { label: `${user.name} - ${user.username}` },
        ]}
      />
      {/* <ErrorBoundary errorComponent={ErrorFallback}>
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
      <Separator /> */}

      {children}
    </HydrateClient>
  );
}
