"use client";

import { Bell, Computer, LogOut, Settings, User } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
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
import { Button } from "@repo/ui/components/button";
import { useSidebar } from "@repo/ui/components/sidebar";
import { useRouter } from "next/navigation";
import { signOut } from "~/actions/signin";
import { routes } from "~/configs/routes";
import { useSession } from "~/providers/AuthProvider";

export function UserNav() {
  const { t } = useLocale();
  const router = useRouter();
  const session = useSession();
  const { isMobile } = useSidebar();
  const user = session.user;
  const initials = user?.name?.charAt(0) ?? "" + user?.name?.charAt(1);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar className="size-8">
            <AvatarImage src={user?.avatar ?? undefined} alt={initials} />
            <AvatarFallback className="rounded-lg uppercase">{`${user?.name?.charAt(0)}${user?.name?.charAt(1)}`}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-60 rounded-lg"
        side={isMobile ? "bottom" : "bottom"}
        align="end"
        //sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={user?.avatar ?? undefined}
                alt={user?.name ?? ""}
              />
              <AvatarFallback className="rounded-lg uppercase">{`${user?.name?.charAt(0)}${user?.name?.charAt(1)}`}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user?.name}</span>
              <span className="truncate text-xs">{user?.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              if (user?.id) router.push(routes.users.details(user.id));
            }}
          >
            <User className="h-4 w-4" />
            <span>{t("profile")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              if (user?.id) router.push(routes.users.settings(user.id));
            }}
          >
            <Settings className="h-4 w-4" />
            <span>{t("settings")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              if (user?.id) router.push(routes.users.logs(user.id));
            }}
          >
            <Computer className="h-4 w-4" />
            <span>{t("logs_and_activities")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:bg-[#FF666618] focus:text-destructive"
          // onClick={() => {
          //   void signOut({ callbackUrl: "/", redirect: true });
          // }}
        >
          <form action={signOut}>
            <button
              className="flex flex-row items-center justify-between"
              type="submit"
            >
              <LogOut className="mr-2 h-4 w-4 text-destructive focus:bg-[#FF666618] focus:text-destructive" />
              <span>{t("logout")}</span>
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
