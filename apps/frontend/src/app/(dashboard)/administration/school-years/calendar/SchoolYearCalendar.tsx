"use client";

import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  ListIcon,
  PlusCircle,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { ToggleGroup, ToggleGroupItem } from "@repo/ui/components/toggle-group";
import { cn } from "@repo/ui/lib/utils";

// Define event types and their colors
const EVENT_TYPES = {
  holiday: {
    label: "Holiday",
    color: "bg-red-100 text-red-800 border-red-200",
  },
  exam: {
    label: "Exam Period",
    color: "bg-amber-100 text-amber-800 border-amber-200",
  },
  break: {
    label: "School Break",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  event: {
    label: "Special Event",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  deadline: {
    label: "Deadline",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
};

// Sample school year data
const SCHOOL_YEAR_DATA = {
  startMonth: 8, // August
  endMonth: 5, // June
  year: 2024,
  events: [
    { date: "2024-08-26", type: "event", name: "First Day of School" },
    { date: "2024-09-02", type: "holiday", name: "Labor Day" },
    { date: "2024-10-14", type: "holiday", name: "Columbus Day" },
    { date: "2024-10-25", type: "deadline", name: "End of First Quarter" },
    { date: "2024-11-11", type: "holiday", name: "Veterans Day" },
    { date: "2024-11-27", type: "break", name: "Thanksgiving Break Start" },
    { date: "2024-11-28", type: "holiday", name: "Thanksgiving Day" },
    { date: "2024-11-29", type: "break", name: "Thanksgiving Break End" },
    { date: "2024-12-16", type: "exam", name: "Final Exams Begin" },
    { date: "2024-12-20", type: "exam", name: "Final Exams End" },
    { date: "2024-12-23", type: "break", name: "Winter Break Start" },
    { date: "2024-12-25", type: "holiday", name: "Christmas Day" },
    { date: "2025-01-01", type: "holiday", name: "New Year's Day" },
    { date: "2025-01-06", type: "event", name: "Classes Resume" },
    { date: "2025-01-20", type: "holiday", name: "Martin Luther King Jr. Day" },
    { date: "2025-02-17", type: "holiday", name: "Presidents' Day" },
    { date: "2025-03-10", type: "break", name: "Spring Break Start" },
    { date: "2025-03-14", type: "break", name: "Spring Break End" },
    { date: "2025-04-07", type: "deadline", name: "End of Third Quarter" },
    { date: "2025-05-19", type: "exam", name: "Final Exams Begin" },
    { date: "2025-05-23", type: "exam", name: "Final Exams End" },
    { date: "2025-05-26", type: "holiday", name: "Memorial Day" },
    { date: "2025-05-30", type: "event", name: "Last Day of School" },
    { date: "2025-06-01", type: "event", name: "Graduation Ceremony" },
  ],
};

// Helper function to get month name
const getMonthName = (month: number) => {
  return new Date(2000, month, 1).toLocaleString("default", { month: "long" });
};

// Helper function to get days in month
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

// Helper function to get day of week (0 = Sunday, 6 = Saturday)
const getDayOfWeek = (year: number, month: number, day: number) => {
  return new Date(year, month, day).getDay();
};

export function SchoolYearCalendar() {
  const [activeFilters, setActiveFilters] = useState<string[]>(
    Object.keys(EVENT_TYPES)
  );
  const [currentYear, setCurrentYear] = useState(SCHOOL_YEAR_DATA.year);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [events, setEvents] = useState(SCHOOL_YEAR_DATA.events);
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    type: "event",
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  // Toggle filter
  const toggleFilter = (type: string) => {
    if (activeFilters.includes(type)) {
      setActiveFilters(activeFilters.filter((t) => t !== type));
    } else {
      setActiveFilters([...activeFilters, type]);
    }
  };

  // Previous school year
  const prevYear = () => {
    setCurrentYear(currentYear - 1);
  };

  // Next school year
  const nextYear = () => {
    setCurrentYear(currentYear + 1);
  };

  // Add new event
  const handleAddEvent = () => {
    if (newEvent.name && newEvent.date && newEvent.type) {
      setEvents([...events, newEvent]);
      setNewEvent({
        name: "",
        date: "",
        type: "event",
      });
      setDialogOpen(false);
    }
  };

  // Generate months for the school year
  const generateMonths = () => {
    const monthsData = [];
    let currentMonth = SCHOOL_YEAR_DATA.startMonth;
    let yearOffset = 0;

    while (true) {
      const actualYear = currentYear + yearOffset;
      const monthName = getMonthName(currentMonth);
      const daysInMonth = getDaysInMonth(actualYear, currentMonth);
      const firstDayOfWeek = getDayOfWeek(actualYear, currentMonth, 1);

      // Generate calendar days
      const days = [];

      // Add empty cells for days before the 1st of the month
      for (let i = 0; i < firstDayOfWeek; i++) {
        days.push(
          <div
            key={`empty-${i}`}
            className="h-16 md:h-20 border border-border/50 bg-muted/20"
          ></div>
        );
      }

      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${actualYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const dayEvents = events.filter(
          (event) => event.date === date && activeFilters.includes(event.type)
        );

        days.push(
          <div
            key={date}
            className="h-16 md:h-20 border border-border/50 p-1 overflow-hidden"
          >
            <div className="text-xs font-medium">{day}</div>
            <div className="mt-1 space-y-1">
              {dayEvents.map((event, index) => (
                <div
                  key={index}
                  className={cn(
                    "text-xs rounded px-1 py-0.5 border truncate",
                    EVENT_TYPES[event.type as keyof typeof EVENT_TYPES].color
                  )}
                  title={event.name}
                >
                  {event.name}
                </div>
              ))}
            </div>
          </div>
        );
      }

      monthsData.push({
        month: currentMonth,
        year: actualYear,
        name: monthName,
        days: days,
      });

      // Move to next month
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        yearOffset++;
      }

      // Break if we've reached the end of the school year
      if (yearOffset > 0 && currentMonth > SCHOOL_YEAR_DATA.endMonth) {
        break;
      }
    }

    // Group months in pairs for side-by-side display
    const monthPairs = [];
    for (let i = 0; i < monthsData.length; i += 2) {
      const pair = [monthsData[i]];
      if (i + 1 < monthsData.length) {
        pair.push(monthsData[i + 1]);
      }
      monthPairs.push(pair);
    }

    return (
      <div className="space-y-8">
        {monthPairs.map((pair, pairIndex) => (
          <div
            key={`pair-${pairIndex}`}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {pair.map((monthData) => (
              <div key={`${monthData?.year}-${monthData?.month}`}>
                <h2 className="mb-2 text-xl font-semibold">
                  {monthData?.name} {monthData?.year}
                </h2>
                <div className="grid grid-cols-7 text-center">
                  <div className="py-1 font-medium text-xs">Sun</div>
                  <div className="py-1 font-medium text-xs">Mon</div>
                  <div className="py-1 font-medium text-xs">Tue</div>
                  <div className="py-1 font-medium text-xs">Wed</div>
                  <div className="py-1 font-medium text-xs">Thu</div>
                  <div className="py-1 font-medium text-xs">Fri</div>
                  <div className="py-1 font-medium text-xs">Sat</div>
                  {monthData?.days}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  // Generate list view of events
  const generateEventsList = () => {
    // Filter events based on active filters and sort by date
    const filteredEvents = events
      .filter((event) => activeFilters.includes(event.type))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
      <div className="space-y-4">
        {filteredEvents.map((event, index) => {
          const eventDate = new Date(event.date);
          const formattedDate = eventDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          return (
            <div
              key={index}
              className={cn(
                "p-4 rounded-lg border",
                EVENT_TYPES[event.type as keyof typeof EVENT_TYPES].color
              )}
            >
              <div className="font-semibold">{event.name}</div>
              <div className="text-sm">{formattedDate}</div>
              <div className="text-xs mt-1">
                {EVENT_TYPES[event.type as keyof typeof EVENT_TYPES].label}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={prevYear}>
            <ChevronLeft className="h-4 w-4" />
            <span className="ml-1">Previous Year</span>
          </Button>
          <Button variant="outline" size="sm" onClick={nextYear}>
            <span className="mr-1">Next Year</span>
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

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className=" h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>
                  Create a new event for the school calendar.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="event-name">Event Name</Label>
                  <Input
                    id="event-name"
                    value={newEvent.name}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="event-date">Date</Label>
                  <Input
                    id="event-date"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, date: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="event-type">Event Type</Label>
                  <Select
                    value={newEvent.type}
                    onValueChange={(value) =>
                      setNewEvent({ ...newEvent, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(EVENT_TYPES).map(([type, { label }]) => (
                        <SelectItem key={type} value={type}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddEvent}>Add Event</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

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

      <div className="rounded-lg border bg-card shadow">
        <div className="p-4">
          <div className="mb-4 flex flex-wrap gap-2">
            {Object.entries(EVENT_TYPES).map(([type, { label, color }]) => (
              <div key={type} className="flex items-center">
                <div
                  className={cn("mr-1 h-3 w-3 rounded-sm", color.split(" ")[0])}
                ></div>
                <span className="text-xs">{label}</span>
              </div>
            ))}
          </div>
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="pr-4">
              {viewMode === "calendar"
                ? generateMonths()
                : generateEventsList()}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
