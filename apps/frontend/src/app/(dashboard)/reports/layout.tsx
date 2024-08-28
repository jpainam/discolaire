import { Briefcase, Users, Warehouse } from "lucide-react";

import { getServerTranslations } from "@repo/i18n/server";

import { TabLink } from "~/components/users/tab-link";
import { routes } from "~/configs/routes";

interface UserLink {
  icon: React.ReactNode;
  name: string;
  href: string;
}
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = await getServerTranslations();

  const userLinks: UserLink[] = [
    {
      name: t("queue"),
      href: routes.reports.index,
      icon: <Warehouse className="h-4 w-4" />,
    },
    {
      name: t("students"),
      href: routes.reports.students,
      icon: <Users className="h-4 w-4" />,
    },
    {
      name: t("classrooms"),
      href: routes.reports.classrooms,
      icon: <Warehouse className="h-4 w-4" />,
    },
    {
      name: t("staffs"),
      href: routes.reports.staffs,
      icon: <Briefcase className="h-4 w-4" />,
    },
  ];
  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex max-w-fit items-center rounded-full bg-muted text-muted-foreground">
        {userLinks.map((link: UserLink, _index) => {
          return (
            <TabLink
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
  );
}
