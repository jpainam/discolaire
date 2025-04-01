"use client";

import { format } from "date-fns";
import { Download, Search, User } from "lucide-react";
import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/accordion";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@repo/ui/components/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@repo/ui/components/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { parseAsIsoDate, useQueryState } from "nuqs";
import { useDebouncedCallback } from "use-debounce";
import { DatePicker } from "~/components/DatePicker";
import { useLocale } from "~/i18n";

// Sample audit log data
const auditLogs = [
  {
    id: "1",
    timestamp: new Date("2023-04-01T10:30:00"),
    user: {
      id: "user-123",
      name: "John Smith",
      role: "Admin",
    },
    source: "User Management",
    event: "Updated Student X's email from abc@example.com to xyz@example.com",
    eventType: "update",
    details: {
      entity: "Student",
      entityId: "student-456",
      field: "email",
      oldValue: "abc@example.com",
      newValue: "xyz@example.com",
    },
  },
  {
    id: "2",
    timestamp: new Date("2023-04-01T11:15:00"),
    user: {
      id: "user-456",
      name: "Sarah Johnson",
      role: "Admin",
    },
    source: "Billing",
    event: "Deleted fee rule for 2024 term",
    eventType: "delete",
    details: {
      entity: "Fee Rule",
      entityId: "fee-789",
      term: "2024",
    },
  },
  {
    id: "3",
    timestamp: new Date("2023-04-01T14:45:00"),
    user: {
      id: "user-789",
      name: "Michael Brown",
      role: "Teacher",
    },
    source: "Grading",
    event: "Added grades to class Y",
    eventType: "create",
    details: {
      entity: "Grades",
      entityId: "class-123",
      className: "Mathematics 101",
    },
  },
  {
    id: "4",
    timestamp: new Date("2023-04-01T16:20:00"),
    user: {
      id: "user-123",
      name: "John Smith",
      role: "Admin",
    },
    source: "System",
    event: "Changed system settings for notification delivery",
    eventType: "update",
    details: {
      entity: "System Settings",
      field: "notification_delivery",
      oldValue: "immediate",
      newValue: "batched",
    },
  },
  {
    id: "5",
    timestamp: new Date("2023-04-02T09:10:00"),
    user: {
      id: "user-456",
      name: "Sarah Johnson",
      role: "Admin",
    },
    source: "User Management",
    event: "Created new user account for David Wilson",
    eventType: "create",
    details: {
      entity: "User",
      entityId: "user-999",
      email: "david.wilson@example.com",
      role: "Teacher",
    },
  },
];

export default function Page() {
  const [date, setDate] = useQueryState("date", parseAsIsoDate);

  const handleSearch = useDebouncedCallback((value: string) => {
    void setSearchQuery(value);
  }, 500);

  const [searchQuery, setSearchQuery] = useQueryState("query", {
    defaultValue: "",
  });
  const [eventTypeFilter, setEventTypeFilter] = useQueryState("eventType", {
    defaultValue: "",
  });
  const [sourceFilter, setSourceFilter] = useQueryState("source", {
    defaultValue: "",
  });
  const [selectedLog, setSelectedLog] = useState<(typeof auditLogs)[0] | null>(
    null,
  );

  // Filter logs based on search query, date, event type, and source
  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      searchQuery === "" ||
      log.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDate =
      !date ||
      format(log.timestamp, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");

    const matchesEventType =
      !eventTypeFilter || log.eventType === eventTypeFilter;

    const matchesSource = !sourceFilter || log.source === sourceFilter;

    return matchesSearch && matchesDate && matchesEventType && matchesSource;
  });

  // Get unique sources for filter dropdown
  const sources = Array.from(new Set(auditLogs.map((log) => log.source)));

  // Get event type badge color
  const getEventTypeBadge = (eventType: string) => {
    switch (eventType) {
      case "create":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Create</Badge>
        );
      case "update":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Update</Badge>;
      case "delete":
        return <Badge className="bg-red-500 hover:bg-red-600">Delete</Badge>;
      default:
        return <Badge>{eventType}</Badge>;
    }
  };
  const { t } = useLocale();

  return (
    <div className="container mx-auto ">
      <Card className="shadow-none rounded-none border-none">
        <CardHeader>
          <CardTitle>{t("audit_logs")}</CardTitle>
          <CardDescription>
            View all system activity and changes made by users
          </CardDescription>
          <CardAction>
            <Button size={"sm"} variant="outline">
              <Download className="h-4 w-4" />
              Export Logs
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t("search")}
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <DatePicker
                defaultValue={date ?? undefined}
                onChange={(val) => {
                  void setDate(val);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Event Type</Label>
              <Select
                value={eventTypeFilter}
                onValueChange={(val) =>
                  setEventTypeFilter(val === "all" ? "" : val)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All event types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"all"}>All event types</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Source</Label>
              <Select
                value={sourceFilter}
                onValueChange={(val) =>
                  setSourceFilter(val === "all" ? "" : val)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"all"}>All sources</SelectItem>
                  {sources.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2 flex flex-col">
        <Table className="font-mono text-xs">
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Event Type</TableHead>
              <TableHead>Event</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No audit logs found.
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow
                  key={log.id}
                  className="group cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedLog(log)}
                >
                  <TableCell className="font-medium py-0">
                    {format(log.timestamp, "MMM d, yyyy")}
                    <div className="text-xs text-muted-foreground">
                      {format(log.timestamp, "h:mm a")}
                    </div>
                  </TableCell>
                  <TableCell className="py-0">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-muted p-1">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <div>{log.user.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {log.user.role}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-0">{log.source}</TableCell>
                  <TableCell className="py-0">
                    {getEventTypeBadge(log.eventType)}
                  </TableCell>
                  <TableCell className="py-0 truncate">{log.event}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Pagination className="w-auto">
          <PaginationContent className="gap-3">
            <PaginationItem>
              <Button
                variant="outline"
                size={"sm"}
                aria-label="Go to previous page"
              >
                {t("previous")}
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                size={"sm"}
                aria-label="Go to next page"
              >
                {t("next")}
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Details Sheet */}
      <Sheet
        open={!!selectedLog}
        onOpenChange={(open) => !open && setSelectedLog(null)}
      >
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Audit Log Details</SheetTitle>
            <SheetDescription>
              {selectedLog?.timestamp
                ? format(selectedLog.timestamp, "PPP 'at' h:mm a")
                : ""}
            </SheetDescription>
          </SheetHeader>

          {selectedLog && (
            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  User
                </h3>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-muted p-2">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{selectedLog.user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedLog.user.role} (ID: {selectedLog.user.id})
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Event Information
                </h3>
                <div className="rounded-md border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="font-medium">{selectedLog.source}</div>
                    {getEventTypeBadge(selectedLog.eventType)}
                  </div>
                  <p>{selectedLog.event}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Details
                </h3>

                {selectedLog.eventType === "update" ? (
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="changes">
                      <AccordionTrigger>Changes</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">
                              Previous Value
                            </h4>
                            <pre className="rounded-md bg-muted p-4 text-xs overflow-auto">
                              {JSON.stringify(
                                {
                                  // @ts-expect-error TODO fix it
                                  [selectedLog.details.field]:
                                    selectedLog.details.oldValue,
                                },
                                null,
                                2,
                              )}
                            </pre>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">New Value</h4>
                            <pre className="rounded-md bg-muted p-4 text-xs overflow-auto">
                              {JSON.stringify(
                                {
                                  // @ts-expect-error TODO fix it
                                  [selectedLog.details.field]:
                                    selectedLog.details.newValue,
                                },
                                null,
                                2,
                              )}
                            </pre>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : (
                  <pre className="rounded-md bg-muted p-4 text-xs overflow-auto">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
