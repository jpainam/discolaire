"use client";

import { MoreVertical } from "lucide-react";
import { FcBearish, FcCalendar, FcClock, FcComboChart } from "react-icons/fc";

import { useCreateQueryString } from "@repo/hooks/create-query-string";
import { useRouter } from "@repo/hooks/use-router";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Label } from "@repo/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@repo/ui/toggle-group";

import { DateRangePicker } from "~/components/shared/DateRangePicker";
import { sidebarIcons } from "../sidebar-icons";

export function AssignmentHeader() {
  const router = useRouter();
  const { t } = useLocale();
  const { createQueryString } = useCreateQueryString();
  const Icon = sidebarIcons["assignments"];
  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-row items-center gap-2 border-b bg-secondary px-2 py-1 text-secondary-foreground">
        {Icon && <Icon className="h-6 w-6" />}
        <Label>{t("assignments")}</Label>

        <div className="ml-auto flex flex-row items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size={"icon"}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between gap-1 border-b px-2 py-1">
        <ToggleGroup
          onValueChange={(val) => {
            router.push("?" + createQueryString({ when: val }));
          }}
          variant={"outline"}
          type="single"
          size={"sm"}
        >
          <ToggleGroupItem className="gap-1" value="today">
            📆 <span>Today</span>
          </ToggleGroupItem>
          <ToggleGroupItem className="gap-1" value="week">
            🗓️<span>Week</span>
          </ToggleGroupItem>
          <ToggleGroupItem className="gap-1" value="month">
            <FcCalendar /> Month
          </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup
          onValueChange={(val) => {
            router.push("?" + createQueryString({ status: val }));
          }}
          variant={"outline"}
          type="single"
          size={"sm"}
        >
          <ToggleGroupItem className="gap-1" value="coming">
            <FcBearish />
            Coming
          </ToggleGroupItem>
          <ToggleGroupItem className="gap-1" value="active">
            <FcComboChart />
            Active
          </ToggleGroupItem>
          <ToggleGroupItem className="gap-1" value="due">
            <FcClock />
            Due
          </ToggleGroupItem>
        </ToggleGroup>
        <DateRangePicker className="w-[250px]" />
      </div>
    </div>
  );
}
