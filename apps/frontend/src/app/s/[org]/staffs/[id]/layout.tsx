import type React from "react";
import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import {
  BookOpenCheck,
  CalendarDays,
  CircleDollarSign,
  Folders,
  History,
  KeySquare,
} from "lucide-react";

import { Skeleton } from "@repo/ui/components/skeleton";

import { getSession } from "~/auth/server";
import { ErrorFallback } from "~/components/error-fallback";
import { NoPermission } from "~/components/no-permission";
import { StaffProfile } from "~/components/staffs/profile/StaffProfile";
import { StaffTabMenu } from "~/components/staffs/profile/StaffTabMenu";
import { StaffDetailHeader } from "~/components/staffs/StaffDetailHeader";
import { routes } from "~/configs/routes";
import { getServerTranslations } from "~/i18n/server";
import { PermissionAction } from "~/permissions";
import { checkPermission } from "~/permissions/server";
import { getQueryClient, HydrateClient, prefetch, trpc } from "~/trpc/server";

interface UserLink {
  icon: React.ReactNode;
  name: string;
  href: string;
}

export default async function Layout(props: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const params = await props.params;

  const { id } = params;
  const queryClient = getQueryClient();

  const { children } = props;
  const session = await getSession();
  const staff = await queryClient.fetchQuery(trpc.staff.get.queryOptions(id));

  if (staff.userId !== session?.user.id) {
    const canReadStaff = await checkPermission("staff", PermissionAction.READ);
    if (!canReadStaff) {
      return (
        <div>
          {staff.userId} {session?.user.id}
          <NoPermission className="my-8" isFullPage resourceText="" />
        </div>
      );
    }
  }

  const { t } = await getServerTranslations();
  prefetch(trpc.staff.all.queryOptions());

  const userLinks: UserLink[] = [
    {
      name: t("timeline"),
      href: routes.staffs.details(id),
      icon: <History className="h-4 w-4" />,
    },
    {
      name: t("permissions"),
      href: `/staffs/${id}/permissions`,
      icon: <KeySquare className="h-4 w-4" />,
    },
    {
      name: t("teachings"),
      href: routes.staffs.teachings(id),
      icon: <BookOpenCheck className="h-4 w-4" />,
    },
    {
      name: t("timetables"),
      href: routes.staffs.timetables(id),
      icon: <CalendarDays className="h-4 w-4" />,
    },

    {
      name: t("payroll"),
      href: `/staffs/${id}/payroll`,
      icon: <CircleDollarSign className="h-4 w-4" />,
    },
    {
      name: t("documents"),
      href: routes.staffs.documents(id),
      icon: <Folders className="h-4 w-4" />,
    },
  ];
  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          key={params.id}
          fallback={
            <div className="px-4 py-2">
              <Skeleton className="h-8" />
            </div>
          }
        >
          <StaffDetailHeader />
        </Suspense>
      </ErrorBoundary>
      <div className="grid gap-2 px-4 2xl:grid-cols-[30%_70%]">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            key={params.id}
            fallback={<Skeleton className="h-20 w-full" />}
          >
            <StaffProfile />
          </Suspense>
        </ErrorBoundary>

        <div className="w-full md:grid-cols-2 xl:grid-cols-3">
          <div className="bg-muted text-muted-foreground flex max-w-fit items-center rounded-full">
            {userLinks.map((link: UserLink, _index) => {
              return (
                <StaffTabMenu
                  key={link.href}
                  href={link.href}
                  icon={link.icon}
                  title={link.name}
                />
              );
            })}
          </div>

          {children}
        </div>
      </div>
    </HydrateClient>
  );
}
