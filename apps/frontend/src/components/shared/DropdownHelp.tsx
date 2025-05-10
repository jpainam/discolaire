"use client";

import { HelpCircleIcon, LibraryBig } from "lucide-react";

import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@repo/ui/components/dropdown-menu";
import { useLocale } from "~/i18n";

import CalendarIcon from "~/components/icons/calendar";
import YoutubeIcon from "~/components/icons/youtube";

export function DropdownHelp() {
  const { t } = useLocale();
  const webinarLink = "https://cal.com/jpainam/discolaire-webinar";
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <HelpCircleIcon className="mr-2 h-4 w-4 text-muted-foreground" />
        <span>{t("help")}</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuItem
            onSelect={() => {
              window.open("https://docs.discolaire.com", "_blank");
            }}
          >
            <LibraryBig />
            <span>{t("how_to_get_started")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              window.open(
                "https://youtube.com/@discolaire?si=3b2XmG6oOVLkhh3n",
                "_blank",
              );
            }}
          >
            <YoutubeIcon />
            <span>{t("watch_a_video")}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => {
              window.open(webinarLink, "_blank");
            }}
          >
            <CalendarIcon />
            <span>{t("join_a_webinar")}</span>
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
