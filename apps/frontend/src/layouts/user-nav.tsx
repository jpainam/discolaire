"use client";

import { Computer, LogOut, Settings, User } from "lucide-react";

import type { RouterOutputs } from "@repo/api";
import { useLocale } from "@repo/i18n";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";

//import { signinout } from "~/app/auth/login/signin";
import { signOut } from "~/actions/signin";
import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { MobileActionButtions } from "~/layouts/mobile-nav";

export function UserNav({
  className,
  user,
}: {
  className?: string;
  user: NonNullable<RouterOutputs["user"]["get"]>;
}) {
  const { t } = useLocale();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar ?? undefined} alt={"AV"} />
            <AvatarFallback className="uppercase">{`${user.name?.charAt(0)}${user.name?.charAt(1)}`}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[250px] rounded-xl" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              router.push(routes.users.details(user.id));
            }}
          >
            <User className="mr-2 h-4 w-4" />
            <span>{t("profile")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              router.push(routes.users.settings(user.id));
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>{t("settings")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              router.push(routes.users.logs(user.id));
            }}
          >
            <Computer className="mr-2 h-4 w-4" />
            <span>{t("logs_and_activities")}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <MobileActionButtions />
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
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t("logout")}</span>
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
