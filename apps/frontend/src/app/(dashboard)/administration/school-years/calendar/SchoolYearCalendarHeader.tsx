"use client";

import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  ListIcon,
  PlusCircle,
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
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs";
import { useModal } from "~/hooks/use-modal";
import { CreateEditSchoolYearEvent } from "./CreateEditSchoolYearEvent";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";

export function SchoolYearCalendarHeader() {
  const { openModal } = useModal();
  const trpc = useTRPC();
  const {data: eventTypes} = useSuspenseQuery(trpc.schoolYearEvent.);

  const [activeFilters, setActiveFilters] = useQueryState(
    "filters",
    parseAsArrayOf(parseAsString).withDefault([
      "holiday",
      "exam",
      "break",
      "event",
      "deadline",
      "other",
    ])
  );
  const [viewMode, setViewMode] = useQueryState(
    "view",
    parseAsString.withDefault("calendar")
  );
  const [year, setYear] = useQueryState(
    "year",
    parseAsInteger.withDefault(2023)
  );
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setYear((old) => old - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous Year</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setYear((old) => old + 1)}
        >
          <span>Next Year</span>
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
              view: <CreateEditSchoolYearEvent />,
            });
          }}
          size="sm"
        >
          <PlusCircle className=" h-4 w-4" />
          Add Event
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
            {Object.entries(EVENT_TYPES).map(([type, { label }]) => (
              <DropdownMenuCheckboxItem
                key={type}
                checked={activeFilters.includes(type)}
                onCheckedChange={() => toggleFilter(type)}
              >
                {label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
