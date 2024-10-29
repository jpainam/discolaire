import React from "react";
import { notFound } from "next/navigation";
import {
  BookOpenCheck,
  CalendarDays,
  DollarSign,
  Folders,
  History,
} from "lucide-react";

import { checkPermissions } from "@repo/api/permission";
import { getServerTranslations } from "@repo/i18n/server";
import { PermissionAction } from "@repo/lib/permission";
import { NoPermission } from "@repo/ui/no-permission";

import { StaffProfile } from "~/components/staffs/profile/StaffProfile";
import { StaffTabMenu } from "~/components/staffs/profile/StaffTabMenu";
import { StaffDetailHeader } from "~/components/staffs/StaffDetailHeader";
import { routes } from "~/configs/routes";
import { api } from "~/trpc/server";

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

  const { children } = props;

  const canReadStaff = await checkPermissions(
    PermissionAction.READ,
    "staff:profile",
    {
      id: id,
    },
  );
  if (!canReadStaff) {
    return <NoPermission className="my-8" isFullPage resourceText="" />;
  }
  const staff = await api.staff.get(id);
  if (!staff) {
    notFound();
  }
  const { t } = await getServerTranslations();

  const userLinks: UserLink[] = [
    {
      name: t("timeline"),
      href: routes.staffs.details(id),
      icon: <History className="h-4 w-4" />,
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
      href: routes.staffs.payroll(id),
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      name: t("documents"),
      href: routes.staffs.documents(id),
      icon: <Folders className="h-4 w-4" />,
    },
  ];
  return (
    <div className="my-1 flex flex-row gap-6">
      <div className="flex flex-col gap-2">
        <StaffDetailHeader />
        <StaffProfile staffId={id} />
      </div>
      <div className="w-full md:grid-cols-2 xl:grid-cols-3">
        <div className="flex max-w-fit items-center rounded-full bg-muted text-muted-foreground">
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

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
