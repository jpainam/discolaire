import {
  RiCodeSSlashLine,
  RiGroup3Line,
  RiHome9Line,
  RiLayoutLeftLine,
  RiLeafLine,
  RiLoginCircleLine,
  RiUserSettingsLine,
} from "@remixicon/react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components/sidebar";
import { House } from "lucide-react";
import Link from "next/link";
import { useLocale } from "~/i18n";

// This is sample data.

export function MainSidebar() {
  const { t } = useLocale();
  const data = {
    navMain: [
      {
        title: "Sections",
        url: "#",
        items: [
          {
            title: t("home"),
            url: "/",
            icon: House,
          },
          {
            title: t("students"),
            url: "/students",
            icon: RiGroup3Line,
          },
          {
            title: t("classrooms"),
            url: "#",
            icon: RiHome9Line,
            isActive: true,
          },
          {
            title: t("contacts"),
            url: "#",
            icon: RiCodeSSlashLine,
          },
          {
            title: t("staffs"),
            url: "#",
            icon: RiLoginCircleLine,
          },
          {
            title: "Layouts",
            url: "#",
            icon: RiLayoutLeftLine,
          },
          {
            title: "Reports",
            url: "#",
            icon: RiLeafLine,
          },
        ],
      },
      {
        title: t("others"),
        url: "#",
        items: [
          {
            title: t("administration"),
            url: "/administrations",
            icon: RiUserSettingsLine,
          },
          {
            title: "Help Center",
            url: "#",
            icon: RiLeafLine,
          },
        ],
      },
    ],
  };
  return (
    <SidebarContent>
      {/* We create a SidebarGroup for each parent. */}
      {data.navMain.map((item) => (
        <SidebarGroup key={item.title}>
          <SidebarGroupLabel className="uppercase text-muted-foreground/60">
            {item.title}
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              {item.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="group/menu-button font-medium gap-3 h-9 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto"
                    isActive={item.isActive}
                  >
                    <Link href={item.url}>
                      <item.icon
                        className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
                        size={22}
                        aria-hidden="true"
                      />

                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </SidebarContent>
  );
}
