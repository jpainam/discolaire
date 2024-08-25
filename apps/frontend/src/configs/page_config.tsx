import { useLocale } from "@/hooks/use-locale";
import { BookText, DatabaseIcon, HomeIcon } from "lucide-react";
import React from "react";
import { routes } from "./routes";

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: React.ReactNode;
  label?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface MainNavItem extends NavItem {}

export interface SidebarNavItem extends NavItemWithChildren {}

interface SearchPageConfig {
  mainNav: MainNavItem[];
  studentMenu?: NavItem[];
  classroomMenu?: NavItem[];
  administrationMenu?: NavItem[];
  sidebarNav: SidebarNavItem[];
}

export function usePageConfig() {
  const { t } = useLocale();
  const searchPages: SearchPageConfig = {
    mainNav: [
      {
        title: t("home"),
        href: "/",
        icon: <HomeIcon className="w-5 h-6" />,
      },
      {
        title: t("datum"),
        href: routes.datum.index,
        icon: <DatabaseIcon className="w-5 h-" />,
      },
      {
        title: t("programs"),
        href: routes.programs.index,
      },
      {
        title: t("report_cards"),
        href: routes.datum.index,
        icon: <BookText className="w-5 h-6" />,
      },
      {
        title: t("reportings"),
        href: routes.reports.index,
      },
      {
        title: t("administration"),
        href: routes.administration.index,
      },
    ],
    sidebarNav: [
      {
        title: "Getting Started",
        items: [
          {
            title: "Introduction",
            href: "/docs",
            items: [],
          },

          {
            title: "Changelog",
            href: "/docs/changelog",
            items: [],
          },
        ],
      },
      {
        title: "Components",
        items: [
          {
            title: "Accordion",
            href: "/docs/components/accordion",
            items: [],
          },

          {
            title: "Tooltip",
            href: "/docs/components/tooltip",
            items: [],
          },
        ],
      },
    ],
  };

  return { searchPages };
}
