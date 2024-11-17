"use client";

import { CircleGauge, LayoutPanelTop, Recycle } from "lucide-react";

import { useLocale } from "@repo/i18n";

import type { TabMenuOption } from "~/components/shared/TabMenu";
import { TabMenu } from "~/components/shared/TabMenu";
import { routes } from "~/configs/routes";

export function ClassroomTabMenu() {
  const { t } = useLocale();
  //const pathname = usePathname();

  const menuTabs: TabMenuOption[] = [
    {
      name: t("levels"),
      href: routes.administration.classrooms.levels,
      icon: <CircleGauge className="h-4 w-4" />,
    },
    {
      name: t("cycles"),
      href: routes.administration.classrooms.cycles,
      icon: <Recycle className="h-4 w-4" />,
    },

    {
      name: t("sections"),
      href: routes.administration.classrooms.sections,
      icon: <LayoutPanelTop className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex max-w-fit items-center rounded-full bg-muted text-muted-foreground">
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
  );
}
