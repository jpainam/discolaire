import {
  BookOpenCheck,
  CalendarDays,
  Folders,
  History,
  KeySquare,
} from "lucide-react";
import React from "react";

import { checkPermission } from "@repo/api/permission";
import { auth } from "@repo/auth";
import { NoPermission } from "~/components/no-permission";
import { getServerTranslations } from "~/i18n/server";
import { PermissionAction } from "~/permissions";

import { StaffProfile } from "~/components/staffs/profile/StaffProfile";
import { StaffTabMenu } from "~/components/staffs/profile/StaffTabMenu";
import { StaffHeader } from "~/components/staffs/StaffHeader";
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
  const session = await auth();
  const staff = await api.staff.get(id);
  const staffIsCurrentUser = session?.user.id === staff.userId;

  const canReadStaff = await checkPermission("staff", PermissionAction.READ);
  if (!staffIsCurrentUser && !canReadStaff) {
    return <NoPermission className="my-8" isFullPage resourceText="" />;
  }

  const { t } = await getServerTranslations();
  const staffs = await api.staff.all();

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

    // {
    //   name: t("payroll"),
    //   href: routes.staffs.payroll(id),
    //   icon: <CircleDollarSign className="h-4 w-4" />,
    // },
    {
      name: t("documents"),
      href: routes.staffs.documents(id),
      icon: <Folders className="h-4 w-4" />,
    },
  ];
  return (
    <div className="flex flex-col gap-2">
      <StaffHeader staffs={staffs} />
      <div className="flex flex-row gap-2 px-4">
        <StaffProfile staffId={id} />

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
    </div>
  );
}
