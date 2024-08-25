"use client";

import { useSearchParams } from "next/navigation";
import { ChevronDown, Plus, Printer, Share2 } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { useCreateQueryString } from "@repo/lib/hooks/create-query-string";
import { useModal } from "@repo/lib/hooks/use-modal";
import { useRouter } from "@repo/lib/hooks/use-router";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Label } from "@repo/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import EventForm from "./EventForm";

export function EventCalendarHeader() {
  const { openModal } = useModal();
  const { t } = useLocale();
  const router = useRouter();
  const { createQueryString } = useCreateQueryString();
  const searchParams = useSearchParams();

  const handleFilterChange = (category: string) => {
    router.push(
      "?" +
        createQueryString({ category: category == "All" ? null : category }),
    );
  };

  return (
    <div className="flex flex-row items-center gap-2 px-2">
      <Label>Calendar type</Label>
      <Select
        defaultValue={searchParams.get("category") || "All"}
        onValueChange={handleFilterChange}
      >
        <SelectTrigger className="h-10 max-w-[200px]">
          <SelectValue placeholder="Select calendar type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Calendar Type</SelectLabel>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="School Year">School Year Calendar</SelectItem>
            <SelectItem value="Teaching">Teaching Calendar</SelectItem>
            <SelectItem value="Holidays">Holidays Calendar</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="ml-auto flex flex-row gap-2">
        <Button
          variant="default"
          size={"sm"}
          onClick={() => {
            openModal({
              title: t("Create a new event"),
              className: "w-full sm:w-[650px] sm:px-8 px-4  ",
              view: <EventForm />,
            });
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Create Event
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"outline"}
              className="flex flex-row items-center gap-1"
              size={"sm"}
            >
              <Printer className="h-3 w-3" />
              {t("print")}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="text-xs">
              <PDFIcon className="mr-2 h-4 w-4" />
              Export the calendar
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs">
              <XMLIcon className="mr-2 h-4 w-4" />
              Export the calendar
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs">
              <Share2 className="mr-2 h-4 w-4" />
              Share the calendar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
