import type { PropsWithChildren } from "react";
import { CircleGauge, FileIcon, FileTextIcon, Settings } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { TabMenuOption } from "~/components/shared/TabMenu";
import { TabMenu } from "~/components/shared/TabMenu";

export default async function Layout(props: PropsWithChildren) {
  const t = await getTranslations();

  const menuTabs: TabMenuOption[] = [
    {
      icon: <CircleGauge className="h-4 w-4" />,
      name: t("dashboard"),
      href: "/administration/grade-reports",
    },
    {
      icon: <FileTextIcon className="h-4 w-4" />,
      name: t("grades"),
      href: "/administration/grade-reports/grades",
    },
    // {
    //   icon: <Euro className="h-4 w-4" />,
    //   name: t("required_fees"),
    //   href:
    //     routes.administration.transactions +
    //     "/required?" +
    //     createQueryString({}),
    // },
    {
      icon: <FileIcon className="h-4 w-4" />,
      name: t("reports"),
      href: "/administration/grade-reports/reports",
    },
    {
      icon: <Settings className="h-4 w-4" />,
      name: t("settings"),
      href: "/administration/grade-reports/settings",
    },
    // {
    //   icon: <HandCoins className="h-4 w-4" />,
    //   name: t("moratoriums"),
    //   href:
    //     routes.administration.transactions +
    //     "/moratoriums?" +
    //     createQueryString({}),
    // },
  ];

  return (
    <div className="flex flex-col gap-2 px-4 py-2">
      <div className="bg-muted text-muted-foreground flex max-w-fit items-center rounded-full border">
        {menuTabs.map((link, _index) => {
          return (
            <TabMenu
              key={link.href}
              //isActive={pathname === link.href}
              href={link.href}
              icon={link.icon}
              title={link.name}
            />
          );
        })}
      </div>
      <div className="flex-1">{props.children}</div>
    </div>
  );
}
