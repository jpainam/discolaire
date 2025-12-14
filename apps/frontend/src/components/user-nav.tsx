"use client";

//import { signinout } from "~/app/auth/login/signin";
import React from "react";
import { initials } from "@dicebear/collection";
//const pathname = usePathname();
import { createAvatar } from "@dicebear/core";
import {
  BellIcon,
  CaptionsIcon,
  ChevronsUpDown,
  CircleUser,
  Computer,
  Settings,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { authClient } from "~/auth/client";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";
import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { LogoutIcon } from "~/icons";

export function UserNav() {
  const [mounted, setMounted] = React.useState(false);

  const t = useTranslations();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { isMobile } = useSidebar();

  const avatar = createAvatar(initials, {
    seed: session?.user.name,
  });

  const user = session?.user;
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!user) return null;
  const name_initials = user.name.charAt(0) + user.name.charAt(1);

  if (!mounted) {
    return <></>;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={
                    user.image
                      ? `/api/download/avatars/${user.image}`
                      : avatar.toDataUri()
                  }
                  alt={name_initials}
                />
                <AvatarFallback className="rounded-lg">
                  {name_initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={
                      user.image
                        ? `/api/download/avatars/${user.image}`
                        : avatar.toDataUri()
                    }
                    alt={name_initials}
                  />
                  <AvatarFallback className="rounded-lg">
                    {name_initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                onSelect={() => {
                  if (user.id) router.push(routes.users.details(user.id));
                }}
              >
                <CircleUser className="h-4 w-4" />
                <span>{t("profile")}</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => {
                  if (user.id) router.push(routes.users.settings(user.id));
                }}
              >
                <Settings className="h-4 w-4" />
                <span>{t("settings")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => router.push(`/users/${user.id}/subscriptions`)}
              >
                <CaptionsIcon />
                {t("subscriptions")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (user.id) router.push(routes.users.logs(user.id));
                }}
              >
                <Computer />
                <span>{t("logs_and_activities")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => router.push(`/users/${user.id}/notifications`)}
              >
                <BellIcon />
                {t("notifications")}
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={async () => {
                await authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push("/auth/login"); // redirect to login page
                    },
                  },
                });
              }}
            >
              <LogoutIcon />
              <span>{t("logout")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
