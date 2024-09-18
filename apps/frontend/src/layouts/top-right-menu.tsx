"use client";

import { CircleHelp, Mail, Printer } from "lucide-react";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";

import { SimpleTooltip } from "~/components/simple-tooltip";
import { ModeToggle } from "~/layouts/mode-toggle";
import { UserNav } from "~/layouts/user-nav";
import { cn } from "~/lib/utils";
import { FeedBackDialog } from "./FeedbackDialog";
import { SearchCommandMenu } from "./search-command-menu";

export function TopRightMenu({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-row items-center", className)}>
      <SearchCommandMenu />
      <nav className="flex items-center gap-2">
        <TopRightButtons />
        <ModeToggle />
        <UserNav />
      </nav>
    </div>
  );
}

export function TopRightButtons() {
  const { openModal } = useModal();
  //const isActive = false;
  const { t } = useLocale("description");
  return (
    <div className="hidden items-center gap-1 pl-2 md:flex">
      {/* <FavoriteLinksSheet /> */}
      {/* <SimpleTooltip content="Notification reçus">
        <Button
          className="active:enabled:translate-y-px"
          size={"icon"}
          aria-label="Notification"
          variant="ghost"
        >
          <NotificationSettingsIcon className="h-[18px] w-auto" />
        </Button>
      </SimpleTooltip> */}
      {/* <NotificationDropdown>
        <Button aria-label="Notification" size={"icon"} variant="ghost">
          <BellRing />
        </Button>
      </NotificationDropdown> */}
      <SimpleTooltip content="Dialoguer">
        <Button
          className="size-8"
          size={"icon"}
          aria-label="Message"
          variant="ghost"
        >
          <Mail className="h-4 w-4" />
        </Button>
      </SimpleTooltip>
      <SimpleTooltip content="Feedback">
        <Button
          className="size-8"
          size={"icon"}
          aria-label="Feedback"
          variant="ghost"
          onClick={() => {
            openModal({
              title: (
                <span className="p-4 text-2xl font-semibold">
                  {t("Feedback")}
                </span>
              ),
              description: (
                <div className="px-4 text-sm">{t("feedback_description")}</div>
              ),
              className: "w-[600px] py-4 px-0",
              view: <FeedBackDialog />,
            });
          }}
        >
          <CircleHelp className="h-4 w-4" />
        </Button>
      </SimpleTooltip>
      <SimpleTooltip content="Imprimer">
        {/* <Button
          variant={"ghost"}
          size={"icon"}
          aria-busy={isActive}
          className="relative size-8"
        >
          <div className="absolute -right-1 -top-1 rounded-full bg-transparent bg-white p-0.5">
            {isActive ? (
              <Loader2 className="h-3 w-3 animate-spin text-yellow-400" />
            ) : (
              <Check className="h-3 w-3 text-green-500" />
            )}
          </div>
          <Printer className="h-4 w-4 text-gray-600" />
        </Button> */}
        <Button
          className="size-8"
          size={"icon"}
          aria-label="Notification"
          variant="ghost"
        >
          <Printer className="h-4 w-4" />
        </Button>
      </SimpleTooltip>
    </div>
  );
}
