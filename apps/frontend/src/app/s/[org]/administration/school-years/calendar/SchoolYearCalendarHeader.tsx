"use client";

import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  ListIcon,
  PlusCircle,
  SquareGanttChartIcon,
} from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@repo/ui/components/toggle-group";

import { useModal } from "~/hooks/use-modal";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { CreateEditSchoolYearEvent } from "./CreateEditSchoolYearEvent";
import { useSchoolYearCalendarContext } from "./SchoolYearCalendarContext";
import { SchoolYearEventTypeTable } from "./SchoolYearEventTypeTable";

export function SchoolYearCalendarHeader() {
  const { openModal } = useModal();

  const {
    filters,
    setFilters,
    viewMode,
    setViewMode,
    currentYear,
    setCurrentYear,
    eventTypes,
  } = useSchoolYearCalendarContext();

  const { t } = useLocale();

  const toggleFilter = (type: string) => {
    if (filters.includes(type)) {
      setFilters(filters.filter((t) => t !== type));
    } else {
      setFilters([...filters, type]);
    }
  };

  const { openSheet } = useSheet();

  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentYear(currentYear - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>{t("Previous Year")}</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentYear(currentYear + 1)}
        >
          <span>{t("Next Year")}</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(value) =>
            value && setViewMode(value as "calendar" | "list")
          }
        >
          <ToggleGroupItem value="calendar" aria-label="Calendar View">
            <CalendarIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List View">
            <ListIcon className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        <Button
          onClick={() => {
            openModal({
              title: "Add New Event",
              description: "Create a new event for the school calendar.",
              view: <CreateEditSchoolYearEvent />,
            });
          }}
          size="sm"
        >
          <PlusCircle className="h-4 w-4" />
          {t("add")}
        </Button>
        <Button
          onClick={() => {
            openSheet({
              title: t("Event Types"),
              description: t("Manage event types for the school calendar."),
              view: <SchoolYearEventTypeTable />,
            });
          }}
          size="icon"
          variant={"secondary"}
        >
          <SquareGanttChartIcon className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
              Filter Events
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Event Types</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {eventTypes.map((type, index) => (
              <DropdownMenuCheckboxItem
                key={index}
                checked={filters.includes(type.id)}
                onCheckedChange={() => toggleFilter(type.id)}
              >
                {type.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
