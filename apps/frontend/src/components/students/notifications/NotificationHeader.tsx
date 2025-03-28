"use client";

import { MailOpen, MoreVertical } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useLocale } from "~/i18n";

import { DateRangePicker } from "~/components/shared/DateRangePicker";
import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { sidebarIcons } from "../sidebar-icons";

export function NotificationHeader() {
  const Icon = sidebarIcons.notifications;
  const params = useParams<{ id: string }>();
  const [value, setValue] = useState("");
  //const debounceValue = useDebounce(value, 500);

  const { createQueryString } = useCreateQueryString();
  const { t } = useLocale();
  const router = useRouter();
  console.log(value);
  return (
    <div className="md:flex grid md:flex-row items-center gap-2 border-b bg-secondary px-2 py-1 text-secondary-foreground">
      {Icon && <Icon className="h-4 w-4 hidden md:block" />}
      <Label className="hidden md:block">{t("notifications")}</Label>

      <Input
        onChange={(event) => {
          setValue(event.target.value);
        }}
        className="h-8 w-full md:w-[300px]"
      />
      <DateRangePicker
        onChange={(dateRange: DateRange | undefined) => {
          const to = dateRange?.to?.toISOString();
          const from = dateRange?.from?.toISOString();
          router.push(
            routes.students.notifications(params.id) +
              "?" +
              createQueryString({ to, from }),
          );
        }}
      />

      <div className="ml-auto flex items-center gap-1">
        <Button size="sm" variant="outline" className="gap-1">
          <MailOpen className="h-4 w-4" />
          <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
            {t("mark_all_as_read")}
          </span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Export</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Trash</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
