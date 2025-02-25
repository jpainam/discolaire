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
        <HelpCircleIcon className="mr-2 h-4 w-4" />
        <span>{t("help")}</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuItem>
            <LibraryBig className="mr-2 h-4 w-4" />
            <span>{t("how_to_get_started")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <YoutubeIcon className="mr-2 h-4 w-4" />
            <span>{t("watch_a_video")}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              window.open(webinarLink, "_blank");
            }}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>{t("join_a_webinar")}</span>
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
