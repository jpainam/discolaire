"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { Download, Share2, ZoomIn, ZoomOut } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Legend,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "~/components/ui/drawer";
import { Progress } from "~/components/ui/progress";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { events } from "~/data/events-staff";
import { useMediaQuery } from "~/hooks/use-media-query";
import { cn } from "~/lib/utils";

// Define the enhanced types
interface EnhancedEvent {
  title: string;
  isChecked: boolean;
  type?: string;
  description: string;
  assignee: string;
  dependencies: string[];
}

interface EnhancedEvents {
  year: number;
  periodType: "Q" | "H";
  periodNumber: number;
  isChecked: boolean;
  events: EnhancedEvent[];
}

// Define the GanttChartRoadmap component
export default function GanttChartRoadmap() {
  // State definitions
  const [selectedEvent, setSelectedEvent] = useState<{
    catIndex: number;
    evtIndex: number;
  } | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [draggedEvent, setDraggedEvent] = useState<{
    catIndex: number;
    evtIndex: number;
    newStart: number;
  } | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Color mappings for event types
  const typeColors = useMemo<Record<string, string>>(
    () => ({
      Development: "var(--chart-1)",
      Marketing: "var(--chart-2)",
      Partnerships: "var(--chart-3)",
      Security: "var(--chart-4)",
      Deployment: "var(--chart-5)",
      Community: "var(--chart-1)",
      "E-commerce": "var(--chart-2)",
    }),
    [],
  );

  const inProgressColors: Record<string, string> = {
    Development: "oklch(0.75 0.15 41.116)",
    Marketing: "oklch(0.70 0.08 184.704)",
    Partnerships: "oklch(0.60 0.05 227.392)",
    Security: "oklch(0.85 0.12 84.429)",
    Deployment: "oklch(0.80 0.12 70.08)",
    Community: "oklch(0.75 0.15 41.116)",
    "E-commerce": "oklch(0.70 0.08 184.704)",
  };

  // Memoized enhanced events with additional fields
  const enhancedEvents: EnhancedEvents[] = useMemo(() => {
    return events.map((period) => ({
      ...period,
      events: period.events.map((event) => ({
        ...event,
        description: `Details for ${event.title}`,
        assignee: "Team A",
        dependencies: event.title.includes("Phase 2") ? ["Phase 1"] : [],
      })),
    }));
  }, []); // Empty dependency since `events` is static

  // Memoized categories based on filters
  const categories = useMemo(() => {
    const grouped: Record<
      string,
      {
        title: string;
        start: number;
        end: number;
        isChecked: boolean;
        type: string;
        description: string;
        assignee: string;
        dependencies: string[];
      }[]
    > = {};
    enhancedEvents.forEach((period) => {
      const periodStart =
        period.year +
        (period.periodType === "Q"
          ? (period.periodNumber - 1) / 4
          : (period.periodNumber - 1) / 2);
      period.events.forEach((event) => {
        if (!event.type) return;
        if (
          (filterType !== "all" && event.type !== filterType) ||
          (filterStatus !== "all" &&
            (filterStatus === "completed" ? !event.isChecked : event.isChecked))
        )
          return;
        grouped[event.type] ??= [];
        // @ts-expect-error TODO FIX THIS
        grouped[event.type].push({
          title: event.title,
          start: periodStart,
          end: periodStart + 0.25,
          isChecked: event.isChecked,
          type: event.type,
          description: event.description,
          assignee: event.assignee,
          dependencies: event.dependencies,
        });
      });
    });
    return grouped;
  }, [enhancedEvents, filterType, filterStatus]);

  // Memoized analytics data
  const typeData = useMemo(() => {
    const types = Object.keys(typeColors);
    return types.map((type) => ({
      name: type,
      completed: Object.values(categories[type] ?? []).filter(
        (e) => e.isChecked,
      ).length,
      total: (categories[type] ?? []).length,
    }));
  }, [categories, typeColors]);

  const densityData = useMemo(() => {
    const periods: Record<string, number> = {};
    enhancedEvents.forEach((period) => {
      const periodKey = `${period.year} ${
        period.periodType === "Q"
          ? `Q${period.periodNumber}`
          : `H${period.periodNumber}`
      }`;
      periods[periodKey] = period.events.length;
    });
    return Object.entries(periods).map(([name, events]) => ({ name, events }));
  }, [enhancedEvents]);

  const totalEvents = Object.values(categories).reduce(
    (sum, events) => sum + events.length,
    0,
  );
  const completedEvents = Object.values(categories).reduce(
    (sum, events) => sum + events.filter((e) => e.isChecked).length,
    0,
  );
  const completionRate =
    totalEvents > 0 ? (completedEvents / totalEvents) * 100 : 0;

  // Export data function
  const exportData = useCallback(
    (format: "json" | "csv") => {
      const data = { typeData, densityData, categories };
      if (format === "json") {
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "gantt-roadmap-analytics.json";
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const csv = [
          "Category,Title,Start,End,Status",
          ...Object.entries(categories).flatMap(([category, events]) =>
            events.map(
              (event) =>
                `${category},${event.title},${event.start},${event.end},${
                  event.isChecked ? "Completed" : "In Progress"
                }`,
            ),
          ),
        ].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "gantt-roadmap-analytics.csv";
        a.click();
        URL.revokeObjectURL(url);
      }
    },
    [typeData, densityData, categories],
  );

  // Share view function
  const shareView = useCallback(async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("filterType", filterType);
    url.searchParams.set("filterStatus", filterStatus);
    await navigator.clipboard.writeText(url.toString());
    alert("View URL copied to clipboard!");
  }, [filterType, filterStatus]);

  // Chart constants
  const timeRange = [2021, 2030] as const;
  const baseWidth = 800;
  const timeScale = (baseWidth * zoomLevel) / (timeRange[1] - timeRange[0]);

  // Selected event details
  let selectedEventDetails = null;
  if (selectedEvent) {
    const cat = Object.keys(categories)[selectedEvent.catIndex];
    if (cat && categories[cat]) {
      selectedEventDetails = categories[cat][selectedEvent.evtIndex];
    }
  }
  // selectedEventDetails =
  //   selectedEvent !== null
  //     ? categories[Object.keys(categories)[selectedEvent.catIndex]]?.[
  //         selectedEvent.evtIndex
  //       ]
  //     : null;

  return (
    <TooltipProvider>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 lg:flex-row">
        {/* Main Gantt Chart Section */}
        <div className="flex-1">
          <motion.h1
            className="text-foreground mb-2 text-3xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Gantt Chart Roadmap
          </motion.h1>
          <motion.p
            className="text-muted-foreground mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            A timeline of events by category
          </motion.p>

          {/* Controls */}
          <div className="mb-4 flex flex-wrap gap-4">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.keys(typeColors).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="incomplete">In Progress</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoomLevel((prev) => Math.min(prev + 0.1, 2))}
              aria-label="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoomLevel((prev) => Math.max(prev - 0.1, 0.5))}
              aria-label="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>

          {/* Legend */}
          <div className="mb-4 flex flex-wrap gap-4">
            {Object.entries(typeColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded-[var(--radius-sm)] transition-colors"
                  style={{ backgroundColor: color }}
                />
                <span className="text-muted-foreground text-sm">{type}</span>
              </div>
            ))}
          </div>

          {/* Gantt Chart */}
          <ScrollArea className="max-h-[600px] w-full" ref={chartRef}>
            <div className="relative" style={{ width: baseWidth * zoomLevel }}>
              {/* Timeline Header */}
              <div className="bg-card border-border sticky top-0 z-10 mb-2 flex border-b">
                {Array.from(
                  { length: Math.ceil(timeRange[1] - timeRange[0]) },
                  (_, i) => timeRange[0] + i,
                ).map((year) => (
                  <div
                    key={year}
                    className="text-muted-foreground flex-1 py-2 text-center text-sm"
                  >
                    {year}
                  </div>
                ))}
              </div>
              {/* Grid Lines */}
              <div className="pointer-events-none absolute top-0 left-0 h-full w-full">
                {Array.from(
                  { length: Math.ceil(timeRange[1] - timeRange[0]) },
                  (_, i) => timeRange[0] + i,
                ).map((year) => (
                  <div
                    key={year}
                    className="border-border absolute h-full border-l border-dashed"
                    style={{ left: `${(year - timeRange[0]) * timeScale}px` }}
                  />
                ))}
              </div>
              {/* Chart Content */}
              <div className="bg-card border-border relative rounded-[var(--radius-md)] border p-4">
                {/* Dependency Lines */}
                {Object.keys(categories).map((category, catIndex) =>
                  categories[category]?.map((event, evtIndex) =>
                    event.dependencies.map((dep, depIdx) => {
                      const depEvent = categories[category]?.find(
                        (e) => e.title === dep,
                      );
                      if (!depEvent) return null;
                      const depLeft = (depEvent.end - timeRange[0]) * timeScale;
                      const eventLeft =
                        (event.start - timeRange[0]) * timeScale;
                      const yOffset = catIndex * 64 + 32;
                      return (
                        <svg
                          key={`${catIndex}-${evtIndex}-dep-${depIdx}`}
                          className="pointer-events-none absolute"
                          style={{
                            left: 0,
                            top: 0,
                            width: baseWidth * zoomLevel,
                            height: "100%",
                          }}
                        >
                          <path
                            d={`M ${depLeft} ${yOffset} H ${eventLeft} V ${yOffset}`}
                            stroke="var(--muted-foreground)"
                            strokeWidth="1"
                            strokeDasharray="4"
                            fill="none"
                          />
                        </svg>
                      );
                    }),
                  ),
                )}
                {/* Event Rows */}
                {Object.keys(categories).map((category, catIndex) => (
                  <div
                    key={category}
                    className="border-border flex h-16 items-center border-b last:border-b-0"
                  >
                    <div className="text-card-foreground w-32 shrink-0 text-sm font-medium">
                      {category}
                    </div>
                    <div className="relative h-full flex-1">
                      {categories[category]?.map((event, evtIndex) => {
                        const totalChartWidth = baseWidth * zoomLevel;
                        const leftUnclamped =
                          (event.start - timeRange[0]) * timeScale;
                        const rightUnclamped =
                          (event.end - timeRange[0]) * timeScale;
                        const widthUnclamped = rightUnclamped - leftUnclamped;

                        let left = Math.max(0, leftUnclamped);
                        let width = widthUnclamped;

                        if (rightUnclamped > totalChartWidth) {
                          width = totalChartWidth - left;
                        }
                        if (width <= 0 || left >= totalChartWidth) return null;

                        const minWidth = 4;
                        if (width < minWidth) {
                          width = minWidth;
                          if (left + width > totalChartWidth) {
                            left = totalChartWidth - width;
                          }
                        }

                        const isDragging =
                          draggedEvent?.catIndex === catIndex &&
                          draggedEvent.evtIndex === evtIndex;
                        const showLabel = width > 50;

                        return (
                          <Tooltip key={evtIndex}>
                            <TooltipTrigger asChild>
                              <motion.div
                                className={cn(
                                  "hover:ring-ring/50 absolute mt-4 flex h-8 cursor-pointer items-center justify-start overflow-hidden rounded-[var(--radius-xl)] shadow-md transition-all hover:ring-2",
                                  event.isChecked && "text-card-foreground",
                                )}
                                style={{
                                  left: isDragging
                                    ? `${draggedEvent.newStart}px`
                                    : `${left}px`,
                                  width: `${width}px`,
                                  backgroundColor: event.isChecked
                                    ? typeColors[category]
                                    : inProgressColors[category],
                                  minWidth: `${minWidth}px`,
                                }}
                                onMouseDown={(e) => {
                                  const startX = e.clientX;
                                  const initialLeft = left;
                                  const onMouseMove = (
                                    moveEvent: MouseEvent,
                                  ) => {
                                    const deltaX = moveEvent.clientX - startX;
                                    const newLeft = Math.max(
                                      0,
                                      Math.min(
                                        initialLeft + deltaX,
                                        baseWidth * zoomLevel - width,
                                      ),
                                    );
                                    setDraggedEvent({
                                      catIndex,
                                      evtIndex,
                                      newStart: newLeft,
                                    });
                                  };
                                  const onMouseUp = () => {
                                    setDraggedEvent(null);
                                    window.removeEventListener(
                                      "mousemove",
                                      onMouseMove,
                                    );
                                    window.removeEventListener(
                                      "mouseup",
                                      onMouseUp,
                                    );
                                  };
                                  window.addEventListener(
                                    "mousemove",
                                    onMouseMove,
                                  );
                                  window.addEventListener("mouseup", onMouseUp);
                                  e.preventDefault(); // Prevent text selection
                                }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.3,
                                  delay: evtIndex * 0.1,
                                }}
                                role="button"
                                tabIndex={0}
                                aria-label={`Event: ${event.title}, ${
                                  event.isChecked ? "Completed" : "In Progress"
                                }`}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    setSelectedEvent({ catIndex, evtIndex });
                                  }
                                }}
                                onClick={() =>
                                  setSelectedEvent({ catIndex, evtIndex })
                                }
                              >
                                {!event.isChecked && (
                                  <Progress
                                    value={50} // Mocked; replace with real data if available
                                    className="absolute top-0 left-0 h-full w-full bg-transparent"
                                  />
                                )}
                                {showLabel && (
                                  <span className="z-10 truncate px-2 text-xs">
                                    {event.title}
                                  </span>
                                )}
                              </motion.div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="font-medium">{event.title}</p>
                              <p className="text-muted-foreground text-xs">
                                {event.isChecked ? "Completed" : "In Progress"}
                              </p>
                              {event.dependencies.length > 0 && (
                                <p className="text-muted-foreground text-xs">
                                  Depends on: {event.dependencies.join(", ")}
                                </p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Analytics Sidebar */}
        <aside className="bg-card border-border w-full rounded-[var(--radius-md)] border p-4 lg:w-80">
          <h2 className="text-card-foreground mb-4 text-xl font-semibold">
            Analytics
          </h2>
          <div className="mb-4 space-y-1">
            <div className="text-muted-foreground text-sm">
              Total Events: {totalEvents}
            </div>
            <div className="text-muted-foreground text-sm">
              Completed: {completedEvents}
            </div>
            <div className="text-muted-foreground text-sm">
              Completion Rate: {completionRate.toFixed(1)}%
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-muted-foreground mb-2 text-sm font-medium">
              Completion by Type
            </h3>
            <BarChart width={260} height={200} data={typeData}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                stroke="var(--muted-foreground)"
              />
              <YAxis stroke="var(--muted-foreground)" />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  color: "var(--popover-foreground)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                }}
              />
              <Legend />
              <Bar dataKey="completed" fill="var(--chart-1)" name="Completed" />
              <Bar
                dataKey="total"
                fill="var(--muted)"
                name="Total"
                opacity={0.4}
              />
            </BarChart>
          </div>
          <div className="mb-6">
            <h3 className="text-muted-foreground mb-2 text-sm font-medium">
              Event Density
            </h3>
            <AreaChart width={260} height={200} data={densityData}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                stroke="var(--muted-foreground)"
              />
              <YAxis stroke="var(--muted-foreground)" />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  color: "var(--popover-foreground)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                }}
              />
              <Area
                type="monotone"
                dataKey="events"
                fill="var(--chart-1)"
                fillOpacity={0.3}
                stroke="var(--chart-1)"
              />
            </AreaChart>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => exportData("json")}
              aria-label="Export as JSON"
            >
              <Download className="mr-2 h-4 w-4" /> JSON
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => exportData("csv")}
              aria-label="Export as CSV"
            >
              <Download className="mr-2 h-4 w-4" /> CSV
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={shareView}
              aria-label="Share View"
            >
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
          </div>
        </aside>
      </div>

      {/* Event Details (Responsive) */}
      {isMobile ? (
        <Drawer
          open={selectedEvent !== null}
          onOpenChange={(open) => !open && setSelectedEvent(null)}
        >
          <DrawerContent className="rounded-t-[var(--radius-md)]">
            <DrawerHeader>
              <DrawerTitle>
                {selectedEventDetails?.title ?? "Event Details"}
              </DrawerTitle>
            </DrawerHeader>
            {selectedEventDetails && (
              <div className="space-y-4 p-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <Badge
                    variant={
                      selectedEventDetails.isChecked ? "default" : "secondary"
                    }
                  >
                    {selectedEventDetails.isChecked
                      ? "Completed"
                      : "In Progress"}
                  </Badge>
                </div>
                <Separator />
                <p>
                  <strong>Description:</strong>{" "}
                  {selectedEventDetails.description}
                </p>
                <p>
                  <strong>Assignee:</strong> {selectedEventDetails.assignee}
                </p>
                <div>
                  <strong>Dependencies:</strong>
                  {selectedEventDetails.dependencies.length > 0 ? (
                    <div className="mt-1 flex flex-wrap gap-2">
                      {selectedEventDetails.dependencies.map((dep) => (
                        <Badge key={dep} variant="outline">
                          {dep}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    " None"
                  )}
                </div>
              </div>
            )}
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog
          open={selectedEvent !== null}
          onOpenChange={(open) => !open && setSelectedEvent(null)}
        >
          <DialogContent className="rounded-[var(--radius-md)]">
            <DialogHeader>
              <DialogTitle>
                {selectedEventDetails?.title ?? "Event Details"}
              </DialogTitle>
            </DialogHeader>
            {selectedEventDetails && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <Badge
                    variant={
                      selectedEventDetails.isChecked ? "default" : "secondary"
                    }
                  >
                    {selectedEventDetails.isChecked
                      ? "Completed"
                      : "In Progress"}
                  </Badge>
                </div>
                <Separator />
                <p>
                  <strong>Description:</strong>{" "}
                  {selectedEventDetails.description}
                </p>
                <p>
                  <strong>Assignee:</strong> {selectedEventDetails.assignee}
                </p>
                <div>
                  <strong>Dependencies:</strong>
                  {selectedEventDetails.dependencies.length > 0 ? (
                    <div className="mt-1 flex flex-wrap gap-2">
                      {selectedEventDetails.dependencies.map((dep) => (
                        <Badge key={dep} variant="outline">
                          {dep}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    " None"
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </TooltipProvider>
  );
}
