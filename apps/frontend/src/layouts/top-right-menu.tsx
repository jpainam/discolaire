"use client";

import { useRouter } from "next/navigation";
import { CircleHelp, Mail, Printer } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { useModal } from "@repo/lib/hooks/use-modal";
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
  const router = useRouter();
  const { openModal } = useModal();
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
