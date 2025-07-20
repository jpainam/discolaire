"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RiContactsLine,
  RiHome9Line,
  RiIdCardLine,
  RiUserSettingsLine,
} from "@remixicon/react";
import { Home, Users2 } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@repo/ui/components/navigation-menu";

import { useLocale } from "~/i18n";

export function NavHeader() {
  const pathname = usePathname();
  const { t } = useLocale();
  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-2 *:data-[slot=navigation-menu-item]:h-7 **:data-[slot=navigation-menu-link]:py-1 **:data-[slot=navigation-menu-link]:font-medium">
        <NavigationMenuItem>
          <NavigationMenuLink asChild data-active={pathname === "/"}>
            <Link href="/" className="flex flex-row items-center gap-1">
              <Home />
              <span>{t("home")}</span>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            data-active={pathname.startsWith("/students")}
          >
            <Link href="/students" className="flex flex-row items-center gap-1">
              <RiIdCardLine />
              <span>{t("students")}</span>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            data-active={pathname.startsWith("/classrooms")}
          >
            <Link
              href="/classrooms"
              className="flex flex-row items-center gap-1"
            >
              <RiHome9Line />
              <span>{t("classrooms")}</span>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            data-active={pathname.startsWith("/staffs")}
          >
            <Link href="/staffs" className="flex flex-row items-center gap-1">
              <Users2 />
              <span>{t("staffs")}</span>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            data-active={pathname.startsWith("/contacts")}
          >
            <Link href="/contacts" className="flex flex-row items-center gap-1">
              <RiContactsLine />
              <span>{t("contacts")}</span>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            data-active={pathname.startsWith("/administration")}
          >
            <Link
              href="/administration"
              className="flex flex-row items-center gap-1"
            >
              <RiUserSettingsLine />
              <span>{t("administration")}</span>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
