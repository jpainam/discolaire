import {
  PiBriefcaseDuotone,
  PiCurrencyCircleDollarDuotone,
  PiDeviceTabletDuotone,
  PiPackageDuotone,
} from "react-icons/pi";

import { routes } from "~/configs/routes";

interface MenuItem {
  name: string;
  href?: string;
  icon?: JSX.Element;
  badge?: string;
  dropdownItems?: MenuItem[];
}
export const menuItems: MenuItem[] = [
  {
    name: "Program",
  },
  {
    name: "Contenu",
    href: "/programs",
  },
  {
    name: "Create",
    href: routes.programs.create,
    icon: <PiDeviceTabletDuotone />,
  },
  {
    name: "Summary",
    href: routes.programs.summary,
    icon: <PiBriefcaseDuotone />,
    badge: "New",
  },
  {
    name: "Homework",
    href: routes.programs.homeworks,
    icon: <PiCurrencyCircleDollarDuotone />,
    badge: "New",
  },
  {
    name: "Monitoring",
    href: routes.programs.monitoring,
    icon: <PiPackageDuotone />,
  },
];
