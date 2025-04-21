/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Bell,
  Computer,
  DollarSignIcon,
  LogOut,
  MoreVerticalIcon,
  Settings,
  User,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { useLocale } from "~/i18n";
//import { signinout } from "~/app/auth/login/signin";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@repo/ui/components/button";
import { SidebarMenuButton, useSidebar } from "@repo/ui/components/sidebar";
import { signOut } from "~/actions/signin";
import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { useSession } from "~/providers/AuthProvider";

export function UserNav({ className }: { className?: string }) {
  const { t } = useLocale();
  const router = useRouter();
  const session = useSession();
  const { isMobile } = useSidebar();

  const user = session.user;
  if (!user) return null;
  const initials = user.name?.charAt(0) ?? "" + user.name?.charAt(1);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
        {isMobile ? (
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar className="h-7 w-7 rounded-lg">
              <AvatarImage
                src={
                  user.avatar
                    ? `/api/download/avatars/${user.avatar}`
                    : undefined
                }
                alt={initials}
              />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="text-muted-foreground truncate text-xs">
                {user.email}
              </span>
            </div>
            <MoreVerticalIcon className="ml-auto size-4" />
          </SidebarMenuButton>
        ) : (
          <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={
                  user.avatar
                    ? `/api/download/avatars/${user.avatar}`
                    : undefined
                }
                alt={initials}
              />
              <AvatarFallback className="rounded-lg uppercase">{`${user.name?.charAt(0)}${user.name?.charAt(1)}`}</AvatarFallback>
            </Avatar>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={isMobile ? "bottom" : "bottom"}
        align="end"
        //sideOffset={4}
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Dialog>
              <DialogTrigger asChild>
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={
                      user.avatar
                        ? `/api/download/avatars/${user.avatar}`
                        : undefined
                    }
                    alt={initials}
                  />
                  <AvatarFallback className="rounded-lg uppercase">{`${user.name?.charAt(0)}${user.name?.charAt(1)}`}</AvatarFallback>
                </Avatar>
              </DialogTrigger>

              <DialogContent className="max-w-[90%] sm:max-w-[600px] p-0">
                <VisuallyHidden>
                  <DialogTitle></DialogTitle>
                </VisuallyHidden>
                <img
                  src={
                    user.avatar
                      ? `/api/download/avatars/${user.avatar}`
                      : undefined
                  }
                  alt="Full Image"
                  className="w-full h-auto rounded-lg"
                />
              </DialogContent>
            </Dialog>

            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
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
            <User className="h-4 w-4" />
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
            <DollarSignIcon />
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
            <Bell />
            {t("notifications")}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="dark:data-[variant=destructive]:focus:bg-destructive/10"
          // onClick={() => {
          //   void signOut({ callbackUrl: "/", redirect: true });
          // }}
        >
          <form action={signOut}>
            <button
              className="flex flex-row items-center justify-between"
              type="submit"
            >
              <LogOut className="text-destructive focus:text-destructive mr-2 h-4 w-4 dark:data-[variant=destructive]:focus:bg-destructive/10" />
              <span>{t("logout")}</span>
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
