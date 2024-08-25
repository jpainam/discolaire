"use client";

import { Computer, LogOut, Settings, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import { useLocale } from "@repo/i18n";
import { useRouter } from "@repo/lib/hooks/use-router";
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

import { routes } from "~/configs/routes";
import { MobileActionButtions } from "~/layouts/mobile-nav";

export function UserNav({ className }: { className?: string }) {
  const { t } = useLocale();
  const router = useRouter();
  const { data } = useSession();
  const user = data?.user;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={(user?.avatar || user?.image) ?? undefined}
              alt={"AV"}
            />
            <AvatarFallback className="uppercase">{`${user?.name?.charAt(0)}${user?.name?.charAt(1)}`}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[250px] rounded-xl" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {data?.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              user?.id && router.push(routes.users.details(user?.id));
            }}
          >
            <User className="mr-2 h-4 w-4" />
            <span>{t("profile")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              user?.id && router.push(routes.users.settings(user?.id));
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>{t("settings")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              user?.id && router.push(routes.users.logs(user?.id));
            }}
          >
            <Computer className="mr-2 h-4 w-4" />
            <span>{t("logs_and_activities")}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <MobileActionButtions />
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive"
          onClick={async () => {
            signOut({ callbackUrl: "/", redirect: true });
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t("logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
