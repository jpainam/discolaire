import { getServerTranslations } from "@/app/i18n/server";
import { TabLink } from "@/components/users/tab-link";
import { routes } from "@/configs/routes";
import { Briefcase, Users, Warehouse } from "lucide-react";

type UserLink = {
  icon: React.ReactNode;
  name: string;
  href: string;
};
export default async function Layout({
  children,
  params,
}: {
  params: { id: string };
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
    <div className="gap-2 flex p-2 flex-col ">
      <div className="flex max-w-fit items-center text-muted-foreground rounded-full bg-muted">
        {userLinks.map((link: UserLink, index) => {
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
