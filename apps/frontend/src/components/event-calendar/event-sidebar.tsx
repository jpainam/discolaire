"use client";

import { RiCheckLine } from "@remixicon/react";
import * as React from "react";
import { useCalendarContext } from "~/components/event-calendar/calendar-context";
import { etiquettes } from "./big-calendar";

import { Checkbox } from "@repo/ui/components/checkbox";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components/sidebar";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useLocale } from "~/i18n";
import { SidebarLogo } from "../sidebar-logo";
import SidebarCalendar from "./sidebar-calendar";

// const data = {
//   user: {
//     name: "Sofia Safier",
//     email: "sofia@safier.com",
//     avatar:
//       "https://res.cloudinary.com/dlzlfasou/image/upload/v1743935337/user-01_l4if9t.png",
//   },
// };

export function EventSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { isColorVisible, toggleColorVisibility } = useCalendarContext();
  const { t } = useLocale();
  return (
    <Sidebar {...props} className=" max-lg:p-3 lg:pe-1">
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t("back_to_home")}>
                <Link href={"/"}>
                  <ArrowLeft />
                  <span>{t("back")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarCalendar />
        </SidebarGroup>
        <SidebarGroup className="px-1 mt-3 pt-4 border-t">
          <SidebarGroupLabel className="uppercase text-muted-foreground/65">
            Calendars
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {etiquettes.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    className="relative rounded-md [&>svg]:size-auto justify-between has-focus-visible:border-ring has-focus-visible:ring-ring/50 has-focus-visible:ring-[3px]"
                  >
                    <span>
                      <span className="font-medium flex items-center justify-between gap-3">
                        <Checkbox
                          id={item.id}
                          className="sr-only peer"
                          checked={isColorVisible(item.color)}
                          onCheckedChange={() =>
                            toggleColorVisibility(item.color)
                          }
                        />
                        <RiCheckLine
                          className="peer-not-data-[state=checked]:invisible"
                          size={16}
                          aria-hidden="true"
                        />
                        <label
                          htmlFor={item.id}
                          className="peer-not-data-[state=checked]:line-through peer-not-data-[state=checked]:text-muted-foreground/65 after:absolute after:inset-0"
                        >
                          {item.name}
                        </label>
                      </span>
                      <span
                        className="size-1.5 rounded-full bg-(--event-color)"
                        style={
                          {
                            "--event-color": `var(--color-${item.color}-400)`,
                          } as React.CSSProperties
                        }
                      ></span>
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
    </Sidebar>
  );
}
